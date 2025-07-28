const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Data file paths
const mentorProfilesPath = path.join(__dirname, 'mentorProfiles.json');
const menteeProfilesPath = path.join(__dirname, 'menteeProfiles.json');
const messagesPath = path.join(__dirname, 'messages.json');
const mentorRequestsPath = path.join(__dirname, 'mentorRequests.json');
const sessionsPath = path.join(__dirname, 'sessions.json');

// Initialize data files if they don't exist
const initializeDataFiles = () => {
  const files = [
    { path: mentorProfilesPath, default: [] },
    { path: menteeProfilesPath, default: [] },
    { path: messagesPath, default: [] },
    { path: mentorRequestsPath, default: [] },
    { path: sessionsPath, default: [] }
  ];

  files.forEach(file => {
    if (!fs.existsSync(file.path)) {
      fs.writeFileSync(file.path, JSON.stringify(file.default, null, 2));
    }
  });
};

initializeDataFiles();

// Helper function to read JSON files
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Helper function to write JSON files
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// mentor ki profiles 
app.post('/api/mentor/saveProfile', (req, res) => {
  try {
    const { id, name, email, phone, bio, experience, skills, linkedin, hourlyRate, availability } = req.body;
    const mentors = readJsonFile(mentorProfilesPath);
    
    const mentorProfile = {
      id: id || Date.now().toString(),
      name,
      email,
      phone,
      bio,
      experience,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      linkedin,
      hourlyRate,
      availability,
      rating: 0,
      totalSessions: 0,
      isAvailable: true,
      createdAt: new Date().toISOString()
    };

    const existingIndex = mentors.findIndex(m => m.id === mentorProfile.id);
    if (existingIndex >= 0) {
      mentors[existingIndex] = { ...mentors[existingIndex], ...mentorProfile };
    } else {
      mentors.push(mentorProfile);
    }

    if (writeJsonFile(mentorProfilesPath, mentors)) {
      res.json({ success: true, message: 'Mentor profile saved successfully', mentor: mentorProfile });
    } else {
      res.status(500).json({ success: false, message: 'Error saving mentor profile' });
    }
  } catch (error) {
    console.error('Error saving mentor profile:', error);
    res.status(500).json({ success: false, message: 'Error saving mentor profile' });
  }
});

app.get('/api/mentor/getProfile/:id', (req, res) => {
  try {
    const mentors = readJsonFile(mentorProfilesPath);
    const mentor = mentors.find(m => m.id === req.params.id);
    
    if (mentor) {
      res.json(mentor);
    } else {
      res.status(404).json({ success: false, message: 'Mentor not found' });
    }
  } catch (error) {
    console.error('Error getting mentor profile:', error);
    res.status(500).json({ success: false, message: 'Error getting mentor profile' });
  }
});

app.get('/api/mentors', (req, res) => {
  try {
    const mentors = readJsonFile(mentorProfilesPath);
    res.json(mentors);
  } catch (error) {
    console.error('Error getting mentors:', error);
    res.status(500).json({ success: false, message: 'Error getting mentors' });
  }
});

// ===== MENTEE PROFILES =====
app.post('/api/mentee/saveProfile', (req, res) => {
  try {
    const { id, name, email, phone, bio, goals, interests, currentLevel } = req.body;
    const mentees = readJsonFile(menteeProfilesPath);
    
    const menteeProfile = {
      id: id || Date.now().toString(),
      name,
      email,
      phone,
      bio,
      goals: Array.isArray(goals) ? goals : goals.split(',').map(g => g.trim()),
      interests: Array.isArray(interests) ? interests : interests.split(',').map(i => i.trim()),
      currentLevel,
      totalSessions: 0,
      createdAt: new Date().toISOString()
    };

    const existingIndex = mentees.findIndex(m => m.id === menteeProfile.id);
    if (existingIndex >= 0) {
      mentees[existingIndex] = { ...mentees[existingIndex], ...menteeProfile };
    } else {
      mentees.push(menteeProfile);
    }

    if (writeJsonFile(menteeProfilesPath, mentees)) {
      res.json({ success: true, message: 'Mentee profile saved successfully', mentee: menteeProfile });
    } else {
      res.status(500).json({ success: false, message: 'Error saving mentee profile' });
    }
  } catch (error) {
    console.error('Error saving mentee profile:', error);
    res.status(500).json({ success: false, message: 'Error saving mentee profile' });
  }
});

app.get('/api/mentee/getProfile/:id', (req, res) => {
  try {
    const mentees = readJsonFile(menteeProfilesPath);
    const mentee = mentees.find(m => m.id === req.params.id);
    
    if (mentee) {
      res.json(mentee);
    } else {
      res.status(404).json({ success: false, message: 'Mentee not found' });
    }
  } catch (error) {
    console.error('Error getting mentee profile:', error);
    res.status(500).json({ success: false, message: 'Error getting mentee profile' });
  }
});

// ===== MENTOR REQUESTS =====
app.post('/api/mentor/request', (req, res) => {
  try {
    const { menteeId, mentorId, message, requestedDate } = req.body;
    const requests = readJsonFile(mentorRequestsPath);
    
    const request = {
      id: Date.now().toString(),
      menteeId,
      mentorId,
      message,
      requestedDate,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString()
    };

    requests.push(request);
    
    if (writeJsonFile(mentorRequestsPath, requests)) {
      res.json({ success: true, message: 'Mentor request sent successfully', request });
    } else {
      res.status(500).json({ success: false, message: 'Error sending mentor request' });
    }
  } catch (error) {
    console.error('Error sending mentor request:', error);
    res.status(500).json({ success: false, message: 'Error sending mentor request' });
  }
});

app.put('/api/mentor/request/:requestId', (req, res) => {
  try {
    const { status, responseMessage } = req.body;
    const requests = readJsonFile(mentorRequestsPath);
    
    const requestIndex = requests.findIndex(r => r.id === req.params.requestId);
    if (requestIndex >= 0) {
      requests[requestIndex].status = status;
      requests[requestIndex].responseMessage = responseMessage;
      requests[requestIndex].respondedAt = new Date().toISOString();
      
      if (writeJsonFile(mentorRequestsPath, requests)) {
        res.json({ success: true, message: `Request ${status} successfully`, request: requests[requestIndex] });
      } else {
        res.status(500).json({ success: false, message: 'Error updating request' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Request not found' });
    }
  } catch (error) {
    console.error('Error updating mentor request:', error);
    res.status(500).json({ success: false, message: 'Error updating mentor request' });
  }
});

app.get('/api/mentor/requests/:mentorId', (req, res) => {
  try {
    const requests = readJsonFile(mentorRequestsPath);
    const mentorRequests = requests.filter(r => r.mentorId === req.params.mentorId);
    res.json(mentorRequests);
  } catch (error) {
    console.error('Error getting mentor requests:', error);
    res.status(500).json({ success: false, message: 'Error getting mentor requests' });
  }
});

app.get('/api/mentee/requests/:menteeId', (req, res) => {
  try {
    const requests = readJsonFile(mentorRequestsPath);
    const menteeRequests = requests.filter(r => r.menteeId === req.params.menteeId);
    res.json(menteeRequests);
  } catch (error) {
    console.error('Error getting mentee requests:', error);
    res.status(500).json({ success: false, message: 'Error getting mentee requests' });
  }
});

// ===== MESSAGING =====
app.post('/api/messages/send', (req, res) => {
  try {
    const { senderId, receiverId, senderType, receiverType, message, sessionId } = req.body;
    const messages = readJsonFile(messagesPath);
    
    const newMessage = {
      id: Date.now().toString(),
      senderId,
      receiverId,
      senderType, // 'mentor' or 'mentee'
      receiverType, // 'mentor' or 'mentee'
      message,
      sessionId,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    
    if (writeJsonFile(messagesPath, messages)) {
      res.json({ success: true, message: 'Message sent successfully', message: newMessage });
    } else {
      res.status(500).json({ success: false, message: 'Error sending message' });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
});

app.get('/api/messages/:userId/:userType', (req, res) => {
  try {
    const { userId, userType } = req.params;
    const messages = readJsonFile(messagesPath);
    
    // Get messages where user is sender or receiver
    const userMessages = messages.filter(m => 
      (m.senderId === userId && m.senderType === userType) ||
      (m.receiverId === userId && m.receiverType === userType)
    );
    
    res.json(userMessages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ success: false, message: 'Error getting messages' });
  }
});

app.put('/api/messages/:messageId/read', (req, res) => {
  try {
    const messages = readJsonFile(messagesPath);
    const messageIndex = messages.findIndex(m => m.id === req.params.messageId);
    
    if (messageIndex >= 0) {
      messages[messageIndex].isRead = true;
      messages[messageIndex].readAt = new Date().toISOString();
      
      if (writeJsonFile(messagesPath, messages)) {
        res.json({ success: true, message: 'Message marked as read' });
      } else {
        res.status(500).json({ success: false, message: 'Error updating message' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Message not found' });
    }
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ success: false, message: 'Error marking message as read' });
  }
});

// ===== SESSIONS =====
app.post('/api/sessions/create', (req, res) => {
  try {
    const { mentorId, menteeId, date, time, duration, topic, notes } = req.body;
    const sessions = readJsonFile(sessionsPath);
    
    const session = {
      id: Date.now().toString(),
      mentorId,
      menteeId,
      date,
      time,
      duration,
      topic,
      notes,
      status: 'scheduled', // scheduled, completed, cancelled
      createdAt: new Date().toISOString()
    };

    sessions.push(session);
    
    if (writeJsonFile(sessionsPath, sessions)) {
      res.json({ success: true, message: 'Session created successfully', session });
    } else {
      res.status(500).json({ success: false, message: 'Error creating session' });
    }
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ success: false, message: 'Error creating session' });
  }
});

app.get('/api/sessions/:userId/:userType', (req, res) => {
  try {
    const { userId, userType } = req.params;
    const sessions = readJsonFile(sessionsPath);
    
    let userSessions;
    if (userType === 'mentor') {
      userSessions = sessions.filter(s => s.mentorId === userId);
    } else {
      userSessions = sessions.filter(s => s.menteeId === userId);
    }
    
    res.json(userSessions);
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ success: false, message: 'Error getting sessions' });
  }
});

app.put('/api/sessions/:sessionId/status', (req, res) => {
  try {
    const { status } = req.body;
    const sessions = readJsonFile(sessionsPath);
    
    const sessionIndex = sessions.findIndex(s => s.id === req.params.sessionId);
    if (sessionIndex >= 0) {
      sessions[sessionIndex].status = status;
      sessions[sessionIndex].updatedAt = new Date().toISOString();
      
      if (writeJsonFile(sessionsPath, sessions)) {
        res.json({ success: true, message: `Session ${status} successfully`, session: sessions[sessionIndex] });
      } else {
        res.status(500).json({ success: false, message: 'Error updating session' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Session not found' });
    }
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ success: false, message: 'Error updating session' });
  }
});

// ===== STATIC ROUTES =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

app.get('/mentee/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mentee-dashboard.html'));
});

app.get('/mentor/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mentor-dashboard.html'));
});

app.get('/mentee/messages', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mentee-messages.html'));
});

app.get('/mentor/messages', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mentor-messages.html'));
});

app.get('/mentee/find-mentors', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mentee-find-mentors.html'));
});

app.get('/mentor/requests', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mentor-requests.html'));
});

app.get('/mentee/sessions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mentee-sessions.html'));
});

app.get('/mentor/sessions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mentor-sessions.html'));
});

app.get('/mentee/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mentee-profile.html'));
});

app.get('/mentor/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mentor-profile.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`MentorConnect platform is ready!`);
  console.log(`Available routes:`);
  console.log(`- / (Authentication)`);
  console.log(`- /mentee/dashboard (Mentee Dashboard)`);
  console.log(`- /mentor/dashboard (Mentor Dashboard)`);
  console.log(`- /mentee/messages (Mentee Messages)`);
  console.log(`- /mentor/messages (Mentor Messages)`);
  console.log(`- /mentee/find-mentors (Find Mentors)`);
  console.log(`- /mentor/requests (Mentor Requests)`);
  console.log(`- /mentee/sessions (Mentee Sessions)`);
  console.log(`- /mentor/sessions (Mentor Sessions)`);
  console.log(`- /mentee/profile (Mentee Profile)`);
  console.log(`- /mentor/profile (Mentor Profile)`);
});
