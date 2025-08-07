// Form persistence utility for preventing data loss
export class FormPersistence {
  constructor(formKey = 'tutorRequestForm') {
    this.storageKey = formKey
    this.saveTimeout = null
  }

  // Save form data to localStorage with debouncing
  saveFormData(formData, delay = 1000) {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }
    
    this.saveTimeout = setTimeout(() => {
      try {
        // Remove sensitive or unnecessary data before saving
        const dataToSave = this.sanitizeFormData(formData)
        localStorage.setItem(this.storageKey, JSON.stringify({
          data: dataToSave,
          timestamp: Date.now(),
          version: '1.0'
        }))
        console.log('Form data saved to localStorage')
      } catch (error) {
        console.error('Error saving form data:', error)
      }
    }, delay)
  }

  // Load form data from localStorage
  loadFormData() {
    try {
      const saved = localStorage.getItem(this.storageKey)
      if (!saved) return null

      const parsed = JSON.parse(saved)
      
      // Check if data is not too old (e.g., 7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      if (Date.now() - parsed.timestamp > maxAge) {
        this.clearFormData()
        return null
      }

      console.log('Form data loaded from localStorage')
      return parsed.data
    } catch (error) {
      console.error('Error loading form data:', error)
      return null
    }
  }

  // Clear saved form data
  clearFormData() {
    try {
      localStorage.removeItem(this.storageKey)
      console.log('Form data cleared from localStorage')
    } catch (error) {
      console.error('Error clearing form data:', error)
    }
  }

  // Check if there's saved form data
  hasSavedData() {
    try {
      const saved = localStorage.getItem(this.storageKey)
      return !!saved
    } catch (error) {
      return false
    }
  }

  // Sanitize form data before saving (remove sensitive info)
  sanitizeFormData(formData) {
    const sanitized = { ...formData }
    
    // Don't save sensitive information
    delete sanitized.phone_number
    delete sanitized.user_email
    
    // Don't save file uploads (too large)
    delete sanitized.upload_file
    
    return sanitized
  }

  // Get the timestamp of last save
  getLastSaveTime() {
    try {
      const saved = localStorage.getItem(this.storageKey)
      if (!saved) return null
      
      const parsed = JSON.parse(saved)
      return new Date(parsed.timestamp)
    } catch (error) {
      return null
    }
  }
}
