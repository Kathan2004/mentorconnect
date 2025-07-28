# MentorConnect - Complete Dual-Sided Mentorship Platform

A modern, comprehensive web platform for connecting students (mentees) with experienced professionals (mentors), built with Node.js, Express, and vanilla JavaScript.

## 🚀 Features

### **Dual-Sided Architecture**
- **Separate dashboards** for mentees and mentors
- **Role-based authentication** and navigation
- **Dedicated interfaces** for each user type

### **For Mentees (Students)**
- **Dashboard**: Overview of learning progress, upcoming sessions, and mentor requests
- **Find Mentors**: Search and filter mentors by skills, experience, availability, and price
- **Request System**: Send mentorship requests with personalized messages
- **Messaging**: Real-time communication with mentors
- **Session Management**: View and manage learning sessions
- **Profile Management**: Update personal information and learning goals

### **For Mentors (Professionals)**
- **Dashboard**: Overview of earnings, active mentees, and pending requests
- **Request Management**: Review, approve, or reject mentorship requests
- **Messaging**: Communicate with mentees
- **Session Management**: Schedule and manage learning sessions
- **Profile Management**: Update expertise, availability, and pricing

### **Core Functionality**
- **Real-time Messaging**: Chat interface for mentor-mentee communication
- **Request System**: Mentees can request mentors, mentors can approve/reject
- **Session Scheduling**: Book and manage learning sessions
- **Profile Management**: Comprehensive profiles for both roles
- **Search & Filter**: Advanced mentor discovery with multiple filters
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Storage**: JSON files (for development)
- **Styling**: Custom CSS with modern design patterns
- **Authentication**: Local storage-based session management

## 📁 Project Structure

```
mentorconnect-1/
├── server.js                 # Main server with all API endpoints
├── package.json              # Dependencies and scripts
├── README.md                 # Project documentation
├── public/                   # Frontend files
│   ├── auth.html            # Authentication and role selection
│   ├── mentee-dashboard.html # Mentee dashboard
│   ├── mentor-dashboard.html # Mentor dashboard
│   ├── mentee-find-mentors.html # Mentor discovery
│   ├── mentor-requests.html # Request management
│   ├── mentee-messages.html # Mentee messaging
│   ├── mentor-messages.html # Mentor messaging
│   ├── mentee-sessions.html # Session management
│   └── styles.css           # Shared styles
├── mentorProfiles.json      # Mentor data storage
├── menteeProfiles.json      # Mentee data storage
├── messages.json            # Message data storage
├── mentorRequests.json      # Request data storage
└── sessions.json            # Session data storage
```

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mentorconnect-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - The authentication page will load first

## 🎯 How to Use

### **Getting Started**
1. Visit `http://localhost:3000`
2. Choose your role (Mentee or Mentor)
3. Create your profile with relevant information
4. Start using the platform!

### **For Mentees**
1. **Create Profile**: Fill in your learning goals and interests
2. **Find Mentors**: Use search and filters to discover mentors
3. **Send Requests**: Request mentorship from chosen mentors
4. **Communicate**: Use the messaging system to stay in touch
5. **Attend Sessions**: Join scheduled learning sessions

### **For Mentors**
1. **Create Profile**: Add your expertise, experience, and availability
2. **Review Requests**: Check and respond to mentorship requests
3. **Communicate**: Message with mentees
4. **Conduct Sessions**: Lead learning sessions
5. **Track Progress**: Monitor your mentoring activities

## 🔌 API Endpoints

### **Authentication & Profiles**
- `POST /api/mentee/saveProfile` - Create/update mentee profile
- `POST /api/mentor/saveProfile` - Create/update mentor profile
- `GET /api/mentee/getProfile/:id` - Get mentee profile
- `GET /api/mentor/getProfile/:id` - Get mentor profile
- `GET /api/mentors` - Get all mentors

### **Mentorship Requests**
- `POST /api/mentor/request` - Send mentorship request
- `PUT /api/mentor/request/:requestId` - Approve/reject request
- `GET /api/mentor/requests/:mentorId` - Get mentor's requests
- `GET /api/mentee/requests/:menteeId` - Get mentee's requests

### **Messaging**
- `POST /api/messages/send` - Send message
- `GET /api/messages/:userId/:userType` - Get user's messages
- `PUT /api/messages/:messageId/read` - Mark message as read

### **Sessions**
- `POST /api/sessions/create` - Create new session
- `GET /api/sessions/:userId/:userType` - Get user's sessions
- `PUT /api/sessions/:sessionId/status` - Update session status

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradients and shadows
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, smooth transitions
- **Color-coded Status**: Visual indicators for different states
- **Empty States**: Helpful guidance when no data is available

## 🔒 Security Features

- **Role-based Access**: Users can only access appropriate pages
- **Input Validation**: Server-side validation for all inputs
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling and user feedback

## 🚀 Future Enhancements

### **Planned Features**
- **Real-time Video Calls**: Integrated video conferencing
- **Payment Integration**: Secure payment processing
- **File Sharing**: Document and resource sharing
- **Progress Tracking**: Learning progress analytics
- **Notifications**: Email and push notifications
- **Database Integration**: Move from JSON to proper database
- **User Authentication**: Secure login system
- **Admin Panel**: Platform administration tools

### **Technical Improvements**
- **WebSocket Integration**: Real-time messaging
- **JWT Authentication**: Secure token-based auth
- **Database Migration**: PostgreSQL or MongoDB
- **API Documentation**: Swagger/OpenAPI docs
- **Testing Suite**: Unit and integration tests
- **CI/CD Pipeline**: Automated deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**MentorConnect** - Connecting learners with experts, one session at a time! 🎓✨ 