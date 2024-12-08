const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Initialize Express
const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Path to store mentor data
const dataFilePath = path.join(__dirname, 'mentorProfile.json');

// Check if the file exists, if not create an empty object
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({}));
}

// Save Profile Data Endpoint
app.post('/saveProfile', (req, res) => {
    const { name, email, phone, bio, experience, skills, linkedin, profileImage } = req.body;

    // Create a mentor profile object
    const mentorProfile = {
        name,
        email,
        phone,
        bio,
        experience,
        skills,
        linkedin,
        profileImage
    };

    // Write the profile data to a local file (JSON)
    fs.writeFileSync(dataFilePath, JSON.stringify(mentorProfile, null, 2));

    res.send('Profile saved successfully');
});

// Get Profile Data Endpoint
app.get('/getProfile', (req, res) => {
    // Read the profile data from the file
    const profileData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    res.json(profileData);
});

// Serve static files like the HTML, CSS, and JS
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
