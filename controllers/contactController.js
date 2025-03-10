exports.sendMessage = (req, res) => {
  try {
    // Validate form data
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields'
      });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }
    
    // Sanitize inputs (already done by xss middleware in app.js)
    
    // In a real application, you would send this data somewhere
    // For example, sending an email, storing in a database, etc.
    console.log('Message received:');
    console.log({ name, email, subject, message });
    
    // For now we'll just simulate success
    res.status(200).json({
      status: 'success',
      message: 'Your message has been sent successfully!'
    });
  } catch (err) {
    console.error('Error in sendMessage controller:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong while sending your message'
    });
  }
};