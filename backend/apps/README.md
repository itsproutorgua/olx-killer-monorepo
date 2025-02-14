# ChatConsumer WebSocket Documentation

## Overview
This document provides an overview of the `ChatConsumer` class, which is responsible for handling WebSocket connections for a chat application using Django Channels.

## WebSocket Endpoints

### Connect (`connect` method)
**Endpoint:** `ws://<server>/ws/chat/<room_id>/`

**Description:**
- Authenticates the user using a JWT token.
- Verifies if the user is part of the chat room.
- Joins the WebSocket group corresponding to the chat room.
- Loads the last 50 messages from the database and sends them to the client.

**Example Response:**
```json
[
    {"text": "Hello!", "sender_email": "user1@example.com"},
    {"text": "Hi there!", "sender_email": "user2@example.com"}
]
```

---

### Disconnect (`disconnect` method)
**Description:**
- Removes the user from the WebSocket group when they disconnect.

---

### Send Message (`receive` method)
**Description:**
- Accepts incoming messages from the WebSocket client.
- Saves the message to the database.
- Broadcasts the message to all users in the chat room.

**Example Request:**
```json
{
    "message": "Hello, how are you?"
}
```

**Broadcasted Message Format:**
```json
{
    "message": "Hello, how are you?"
}
```

---

### Receive Broadcasted Messages (`chat_message` method)
**Description:**
- Sends messages received from the WebSocket group to the connected WebSocket clients.

---

## Authentication
- The WebSocket connection requires a valid JWT token in the `Authorization` header.
- Token is extracted and validated using `Auth0JWTAuthentication`.
- If authentication fails, the connection is closed.

---

## Error Handling
- If the chat room is not found, the connection is closed.
- If the user is not part of the chat room, the connection is closed.
- If a database field error occurs while loading messages, an empty message list is returned


---

## Testing the WebSocket Connection

### Using Postman
1. Open Postman and go to the **WebSocket** section.
2. Enter the WebSocket URL: `ws://<server>/ws/chat/<room_id>/`.
3. Add an `Authorization` header with a valid JWT token.
4. Click **Connect**.
5. Send a sample message:
   ```json
   {
       "message": "Hello, this is a test message!"
   }
   ```
6. Verify that the response contains the sent message.

### From a Frontend Application
To connect using JavaScript:
```javascript
const socket = new WebSocket("ws://<server>/ws/chat/<room_id>/");

socket.onopen = function(event) {
    console.log("Connected to WebSocket");
    socket.send(JSON.stringify({ "message": "Hello from frontend!" }));
};

socket.onmessage = function(event) {
    console.log("Received message:", event.data);
};

socket.onclose = function(event) {
    console.log("Disconnected from WebSocket");
};
```