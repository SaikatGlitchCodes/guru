// Alternative API functions that don't rely on specific foreign key constraint names

/**
 * Send a message (Alternative approach)
 */
export async function sendMessage(messageData) {
  try {
    // First insert the message
    const { data: newMessage, error: insertError } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single()

    if (insertError) throw insertError

    // Then fetch with user data
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!inner(name, avatar_url),
        recipient:users!inner(name, avatar_url)
      `)
      .eq('id', newMessage.id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error sending message:', error)
    return { data: null, error }
  }
}

/**
 * Get conversations for a user (Alternative approach)
 */
export async function getUserConversations(userId) {
  try {
    // Fetch messages with separate queries for sender and recipient
    const { data: messagesAsSender, error: senderError } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!inner(id, name, avatar_url),
        recipient:users!inner(id, name, avatar_url)
      `)
      .eq('sender_id', userId)
      .order('created_at', { ascending: false })

    const { data: messagesAsRecipient, error: recipientError } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!inner(id, name, avatar_url),
        recipient:users!inner(id, name, avatar_url)
      `)
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })

    if (senderError) throw senderError
    if (recipientError) throw recipientError

    // Combine and sort all messages
    const allMessages = [...(messagesAsSender || []), ...(messagesAsRecipient || [])]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    // Group messages by conversation
    const conversations = {}
    allMessages.forEach(message => {
      const otherUserId = message.sender_id === userId ? message.recipient_id : message.sender_id
      const otherUser = message.sender_id === userId ? message.recipient : message.sender
      
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          user: otherUser,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        }
      }
      
      conversations[otherUserId].messages.push(message)
      
      if (!conversations[otherUserId].lastMessage || 
          new Date(message.created_at) > new Date(conversations[otherUserId].lastMessage.created_at)) {
        conversations[otherUserId].lastMessage = message
      }
      
      if (!message.read && message.recipient_id === userId) {
        conversations[otherUserId].unreadCount++
      }
    })

    // Sort conversations by last message time
    const sortedConversations = Object.values(conversations).sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0
      if (!a.lastMessage) return 1
      if (!b.lastMessage) return -1
      return new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
    })

    return { data: sortedConversations, error: null }
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return { data: null, error }
  }
}
