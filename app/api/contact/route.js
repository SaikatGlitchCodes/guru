import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, type } = body

    // Validate required fields
    if (!name || !email || !message || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Get inquiry type label
    const inquiryTypes = {
      general: 'General Inquiry',
      support: 'Technical Support',
      tutor: 'Become a Tutor',
      business: 'Business Partnership',
      billing: 'Billing & Payments',
      feedback: 'Feedback & Suggestions'
    }

    const inquiryType = inquiryTypes[type] || 'General Inquiry'

    // Prepare email content
    const emailSubject = `[${inquiryType}] ${subject}`
    
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #495057; display: block; margin-bottom: 5px; }
            .value { color: #212529; background: #f8f9fa; padding: 8px; border-radius: 4px; }
            .message { background: #e3f2fd; padding: 15px; border-radius: 4px; border-left: 4px solid #2196f3; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 14px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0; color: #2196f3;">New Contact Form Submission</h2>
              <p style="margin: 10px 0 0 0; color: #6c757d;">Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
            
            <div class="content">
              <div class="field">
                <span class="label">Inquiry Type:</span>
                <div class="value">${inquiryType}</div>
              </div>
              
              <div class="field">
                <span class="label">Name:</span>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <span class="label">Email:</span>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              ${phone ? `
              <div class="field">
                <span class="label">Phone:</span>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Subject:</span>
                <div class="value">${subject}</div>
              </div>
              
              <div class="field">
                <span class="label">Message:</span>
                <div class="message">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Quick Actions:</strong></p>
              <p>
                📧 <a href="mailto:${email}">Reply to ${name}</a><br>
                ${phone ? `📞 <a href="tel:${phone}">Call ${phone}</a><br>` : ''}
                🌐 <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin">View Admin Dashboard</a>
              </p>
              <p><em>This email was sent from the TopTutor contact form.</em></p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
New Contact Form Submission
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Inquiry Type: ${inquiryType}
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Subject: ${subject}

Message:
${message}

---
Reply to: ${email}
${phone ? `Call: ${phone}` : ''}
    `

    // Send email to business
    const emailData = await resend.emails.send({
      from: 'TopTutor Contact <contact@toptutor.com>',
      to: ['toptutorcontact@gmail.com'],
      subject: emailSubject,
      html: emailHTML,
      text: emailText,
      replyTo: email
    })

    // Send confirmation email to user
    const confirmationEmailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for contacting TopTutor</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2196f3; color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .content { background: white; padding: 25px; border: 1px solid #e9ecef; border-radius: 8px; }
            .highlight { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 14px; color: #6c757d; text-align: center; }
            .contact-info { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You for Contacting Us!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your message</p>
            </div>
            
            <div class="content">
              <p>Dear ${name},</p>
              
              <p>Thank you for reaching out to TopTutor! We've successfully received your message regarding "<strong>${subject}</strong>" and our team will review it shortly.</p>
              
              <div class="highlight">
                <h3 style="margin-top: 0; color: #2196f3;">What happens next?</h3>
                <ul style="margin-bottom: 0;">
                  <li>Our support team will review your inquiry</li>
                  <li>You'll receive a response within 24 hours</li>
                  <li>For urgent matters, feel free to call us directly</li>
                </ul>
              </div>
              
              <div class="contact-info">
                <h4 style="margin-top: 0; color: #495057;">Need immediate assistance?</h4>
                <p style="margin-bottom: 0;">
                  📞 <strong>Phone:</strong> <a href="tel:+918884058512">+91 88840 58512</a><br>
                  📧 <strong>Email:</strong> <a href="mailto:toptutorcontact@gmail.com">toptutorcontact@gmail.com</a>
                </p>
              </div>
              
              <p>In the meantime, feel free to explore our platform:</p>
              <ul>
                <li><a href="${process.env.NEXT_PUBLIC_BASE_URL}/find-tutors">Find qualified tutors</a></li>
                <li><a href="${process.env.NEXT_PUBLIC_BASE_URL}/request-tutor">Request a tutor</a></li>
                <li><a href="${process.env.NEXT_PUBLIC_BASE_URL}/">Browse our services</a></li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Best regards,<br><strong>The TopTutor Team</strong></p>
              <p style="margin-top: 15px;"><em>This is an automated confirmation email. Please do not reply to this email.</em></p>
            </div>
          </div>
        </body>
      </html>
    `

    await resend.emails.send({
      from: 'TopTutor Support <support@toptutor.com>',
      to: [email],
      subject: 'Thank you for contacting TopTutor - We\'ve received your message',
      html: confirmationEmailHTML,
      text: `Dear ${name},

Thank you for contacting TopTutor! We've received your message regarding "${subject}".

Our team will review your inquiry and respond within 24 hours.

For immediate assistance:
Phone: +91 88840 58512
Email: toptutorcontact@gmail.com

Best regards,
The TopTutor Team`
    })

    console.log('Contact form email sent successfully:', emailData)

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    })

  } catch (error) {
    console.error('Error sending contact form email:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again or contact us directly.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
