# ChatConsumer WebSocket Documentation

## Overview

## API Endpoints

## WebSocket Endpoints

### Connect
**Endpoint:** `ws://127.0.0.1:8001/ws/chat/?firts_user=<int>&second_user=<int>/`

firts_user - sender id
second_user - reciever id

**Description:**
- Authenticates the user using a JWT token.
- Verifies if the user is part of the chat room.
- Joins the WebSocket group corresponding to the chat room.
- Loads the last 50 messages from the database and sends them to the client.
  
**Example method**

```javascript
    const socket = new WebSocket("ws://127.0.0.1:8001/ws/chat/?firts_user=1&second_user=2/", ["Bearer", jwt_token]);

    socket.onopen = function () {
        console.log("Connected to websocket");
    };
```
  
---

### Send Last Messages 
**Description:**
- After connection automatically downloads the last 50 messages after from the database and sends them to the client.

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

### Send Message 
**Description:**
- Accepts incoming messages from the WebSocket client.
- Saves the message to the database.

**Example Request:**
```json
{
    "action": "send",
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

### Edit message

**Example request**
```json
{
    "action": "edit",
    "message_id": 63,
    "text": "new message"
}
```

**Example resonce**
```json
{
    "type": "message_edited", 
    "message_id": 63, 
    "text": "new message"
}
```
---

### Delete message

**Example request**
```json
{
    "action": "delete",
    "message_id": 63,
}
```

**Example resonce**
```json
{
    "type": "message_deleted", 
    "message_id": 63
}
```

---

## Error Handling
- If the chat room is not found, the connection is closed.
- If the user is not part of the chat room, the connection is closed.
- If a database field error occurs while loading messages, an empty message list is returned.

---

## Testing the WebSocket Connection

## Example code

```javascript
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Socket chat</title>
    <style>
      body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

      #form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
      #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
      #input:focus { outline: none; }
      #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }

      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages > li { padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; }
      #messages > li:nth-child(odd) { background: #efefef; }
      .delete-btn { background: none; border: none; color: red; font-size: 1rem; cursor: pointer; }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form id="form">
      <input id="input" autocomplete="off" /><button>Send</button>
    </form>
    <script>
        const token = "token"
        const socket = new WebSocket("ws://127.0.0.1:8001/ws/chat/?firts_user=1&second_user=2/", ["Bearer", token]);

        socket.onopen = function () {
            console.log("Connected to  WebSocket");
        };

        socket.onmessage = function (event) {
            console.log("Message received", event.data);
            const data = JSON.parse(event.data);
        };

        socket.onerror = function (error) {
            console.error("Error WebSocket:", error);
        };

        socket.onclose = function (event) {
            console.log(" WebSocket closed:", event.code, event.reason);
        };

        document.getElementById("form").addEventListener("submit", function (e) {
            e.preventDefault();
            sendMessage();
        });

        function sendMessage() {
            const input = document.getElementById("input");
            if (input.value.trim() !== "") {
                socket.send(JSON.stringify({
                    action: "send",
                    message: input.value
                }));
                input.value = "";  
            }
        }

        function deleteMessage(messageId) {
            socket.send(JSON.stringify({
                action: "delete",
                message_id: messageId
            }));
        }

        function editMessage(messageId, newMessage) {
            socket.send(JSON.stringify({
                action: "edit",
                message_id: messageId,
                text: newMessage
            }));
        }

        function addMessageToList(messageId, user, message) {
            const li = document.createElement("li");
            li.id = `msg-${messageId}`;
            li.innerHTML = `<span><b>${user}:</b> ${message}</span> 
                            <button class="delete-btn" onclick="deleteMessage('${messageId}')">🗑</button>`;
            document.getElementById("messages").appendChild(li);
        }

        function removeMessageFromList(messageId) {
            const messageElement = document.getElementById(`msg-${messageId}`);
            if (messageElement) {
                messageElement.remove();
            }
        }
    </script>
  </body>
</html>

```