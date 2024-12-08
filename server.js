const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the inbox page
app.get('/inbox.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inbox.html'));
});

// Route to handle saving a message
app.post('/send-message', (req, res) => {
  const { message } = req.body;

  if (message && message.trim() !== '') {
    // Ensure messages.json exists and is readable
    const filePath = path.join(__dirname, 'messages.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      let messages = [];
      
      if (!err) {
        // If file exists, parse the messages
        messages = JSON.parse(data);
      }

      // Add the new message
      messages.push({ message, timestamp: new Date().toISOString() });

      // Save the updated messages back to the file
      fs.writeFile(filePath, JSON.stringify(messages, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error saving the message' });
        }
        res.status(200).json({ message: 'Message saved successfully!' });
      });
    });
  } else {
    res.status(400).json({ message: 'Message cannot be empty!' });
  }
});

// Route to fetch messages for the inbox
app.get('/get-messages', (req, res) => {
  const filePath = path.join(__dirname, 'messages.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      // If file does not exist, send an empty array
      return res.status(500).json({ message: 'Error loading messages' });
    }
    res.status(200).json(JSON.parse(data));
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
