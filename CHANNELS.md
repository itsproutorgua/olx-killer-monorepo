# ChatConsumer WebSocket Documentation

## Overview
This document provides an overview of the `ChatConsumer` class, which is responsible for handling WebSocket connections for a chat application using Django Channels.

## WebSocket Endpoints

### Connect (`connect` method)
**Endpoint:** `ws://127.0.0.1:8001/ws/chat/<room_id>/`

**Description:**
- Authenticates the user using a JWT token.
- Verifies if the user is part of the chat room.
- Joins the WebSocket group corresponding to the chat room.
- Loads the last 50 messages from the database and sends them to the client.

### Disconnect (`disconnect` method)
**Description:**
- Removes the user from the WebSocket group when they disconnect.
- Updates the user's status to offline.

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
    "type": "chat_message",
    "message_id": 1
}
```

**Example Response:**
```json
{
    "type": "chat_message",
    "message": {
        "text": "Hello, how are you?",
        "message_id": 1,
        "sender_id": 1,
        "status": "send",
        "created_at": "2025-02-16T12:34:56.789Z",
        "updated_at": "2025-02-16T12:34:56.789Z"
    }
},
{
    "type": "mark_message_as_delivered",
    "message": {
        "text": "Hello, how are you?",
        "message_id": 1,
        "sender_id": 1,
        "status": "delivered",
        "created_at": "2025-02-16T12:34:56.789Z",
        "updated_at": "2025-02-16T12:34:56.789Z"
    }
},
{
    "type": "mark_message_as_read",
    "message": {
        "text": "Hello, how are you?",
        "message_id": 1,
        "sender_id": 1,
        "status": "read",
        "created_at": "2025-02-16T12:34:56.789Z",
        "updated_at": "2025-02-16T12:34:56.789Z"
    }
}
```

---

### Receive Broadcasted Messages (`chat_message` method)
**Description:**
- Sends messages received from the WebSocket group to the connected WebSocket clients.

---

### Mark Message as Delivered (`mark_message_as_delivered` method)
**Description:**
- Marks the message as delivered.
- Sends the message to the client.
- If the recipient is online, marks the message as read.

**Example Event:**
```json
{
    "type": "mark_message_as_delivered",
    "message": {
        "text": "Hello, how are you?",
        "message_id": 1,
        "sender_id": 1,
        "status": "delivered",
        "created_at": "2025-02-16T12:34:56.789Z",
        "updated_at": "2025-02-16T12:34:56.789Z"
    }
}
```

---

### Mark Message as Read (`mark_message_as_read` method)
**Description:**
- Marks the message as read.
- Sends the message to the client.

**Example Event:**
```json
{
    "type": "mark_message_as_read",
    "message": {
        "text": "Hello, how are you?",
        "message_id": 1,
        "sender_id": 1,
        "status": "read",
        "created_at": "2025-02-16T12:34:56.789Z",
        "updated_at": "2025-02-16T12:34:56.789Z"
    }
}
```

---


### Send Last Messages (`send_last_messages` method)
**Description:**
- Loads the last 50 messages from the database and sends them to the client.

**Example Response:**
```json
[
    {
        "text": "Hello, how are you?",
        "sender_email": "user1@example.com"
    },
    {
        "text": "I'm good, thanks!",
        "sender_email": "user2@example.com"
    }
]
```

---

## Authentication
- The WebSocket connection requires a valid JWT token in the `Authorization` header.
- Token is extracted and validated using `Auth0JWTAuthentication`.
- If authentication fails, the connection is closed.

---

## Error Handling
- If the chat room is not found, the connection is closed.
- If the user is not part of the chat room, the connection is closed.
- If a database field error occurs while loading messages, an empty message list is returned.

---

## Testing the WebSocket Connection

### Using Postman
1. Open Postman and go to the **WebSocket** section.
2. Enter the WebSocket URL: `ws://127.0.0.1:8001/ws/chat/<room_id>/`.
3. Add an `Authorization` header with a valid JWT token.
Example
```json
{
    "Authorization": "Bearer <token>"
}

```
4. Click **Connect**.
5. Send a sample message:
   ```json
   {
       "message": "Hello, this is a test message!"
   }
   ```
3. Verify that the response contains the sent message.

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