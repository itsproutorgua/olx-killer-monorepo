# ChatConsumer WebSocket Documentation

## Overview

## API Endpoints

### Create Chat Room (`POST  http://127.0.0.1:8000/en/api/v1/chatrooms/get_or_create_room/?user_id_1=<int:user_id_1>&user_id_2=<int:user_id_2>`)
**Description:**
- Creates a chat room between two users.

**Example Request:**
```http
POST http://127.0.0.1:8000/en/api/v1/chatrooms/get_or_create_room/?user_id_1=3&user_id_2=4
Authorization: Bearer <token>
Content-Type: application/json
```

**Example Response:**
status_code = 200
```json
{
    "room_id": 1
}
```

### Edit Message (`PUT  http://127.0.0.1:8000/en/api/v1/messages/{message_id}/edit`)
**Description:**
- Edits the text of a message sent by the authenticated user.

**Example Request:**
```http
PUT  http://127.0.0.1:8000/en/api/v1/messages/1/edit
Authorization: Bearer <token>
Content-Type: application/json

{
    "text": "Updated message text"
}
```

**Example Response:**
status_code = 200
```json
{
    "status": "success",
    "message": "Message updated successfully"
}
```
And message to websocket
```json
{
    "type": "message_edited",
    "message_id": 55,
    "text": "Updated message text"
}
```

### Delete Message (`DELETE  http://127.0.0.1:8000/en/api/v1/messages/{message_id}/delete`)
**Description:**
- Deletes a message sent by the authenticated user.

**Example Request:**
```http
DELETE  http://127.0.0.1:8000/en/api/v1/messages/1/delete
Authorization: Bearer <token>
```

**Example Response:**
status_code = 204
```json
{
    "status": "success",
    "message": "Message deleted successfully"
}
```
And message to websocket
```json
{
    "type": "message_deleted",
    "message_id": 56
}
```


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
        "message_id": 45,
        "text": "hello",
        "sender_email": "daragan.liza@gmail.com",
        "status": "read",
        "created_at": "2025-02-18T18:28:52.258755+00:00",
        "updated_at": "2025-02-18T18:28:52.258773+00:00"
    },
    {
        "message_id": 44,
        "text": "hello",
        "sender_email": "daragan.liza@gmail.com",
        "status": "read",
        "created_at": "2025-02-16T21:20:22.998221+00:00",
        "updated_at": "2025-02-16T21:20:22.998242+00:00"
    },
    {
        "message_id": 43,
        "text": "hello",
        "sender_email": "gavriliuk.sviatoslav@gmail.com",
        "status": "read",
        "created_at": "2025-02-16T20:50:16.726344+00:00",
        "updated_at": "2025-02-21T16:57:26.073464+00:00"
    },
    {
    ...
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
1. Open Postman and select **HTTP** requests type.
2. Enter the HTTP url `http://127.0.0.1:8000/en/api/v1/chatrooms/get_or_create_room/?user_id_1=<int:user_id_1>&user_id_2=<int:user_id_2>` and send POST request
3. After you get responce, switch requests type to **WebSocket**
4. Enter the WebSocket URL: `ws://127.0.0.1:8001/ws/chat/<room_id>/`.
5. Add an `Authorization` header with a valid JWT token.
Example
```http
    "Authorization": "Bearer <token>"
```
6. Click **Connect**.
7. Send a sample message:
   ```json
   {
       "message": "Hello, this is a test message!"
   }
   ```
8. Verify that the response contains the sent message.
