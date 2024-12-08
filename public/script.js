const sendButton = document.querySelector('.send-button');
const messageInput = document.querySelector('.message-input');
const chatBox = document.querySelector('.chat-box');
const typingIndicator = document.querySelector('#typing-indicator');

// Fetch messages when the page loads
document.addEventListener('DOMContentLoaded', fetchMessages);

// Fetch messages from the server
function fetchMessages() {
    fetch('/get-messages')
        .then(response => response.json())
        .then(data => {
            chatBox.innerHTML = ''; // Clear existing messages

            // Loop through the messages and append them to the chatbox
            data.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', message.sender === 'me' ? 'sent' : 'received');
                messageElement.innerHTML = `<p>${message.message}</p>`;
                chatBox.appendChild(messageElement);
            });

            // Scroll to the bottom
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(err => console.error('Error fetching messages:', err));
}

// Send message when the user clicks the send button
sendButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        sendMessage(messageText); // Send the message
        playSendSound(); // Play sound after sending a message
    }
});

// Send message to the server
function sendMessage(message) {
    fetch('/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Message saved successfully!') {
            fetchMessages(); // Reload messages after sending
            messageInput.value = ''; // Clear the input
            typingIndicator.style.display = 'none'; // Hide typing indicator
        } else {
            console.error('Error sending message');
        }
    })
    .catch(err => console.error('Error sending message:', err));
}

// Optional: Handle Enter key to send message
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && messageInput.value.trim()) {
        sendButton.click();
    }
});

// Show typing indicator while user is typing
messageInput.addEventListener('input', () => {
    typingIndicator.style.display = messageInput.value.trim() ? 'block' : 'none';
});

// Play sound when a message is sent
function playSendSound() {
    const audio = new Audio('send-sound.mp3');
    audio.play();
}
