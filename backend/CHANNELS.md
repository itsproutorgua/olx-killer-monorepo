# ChatConsumer WebSocket Documentation

## Overview

## API Endpoints

### Creating chat room 
[swagger](https://api.house-community.site/en/api/v1/swagger/)


### Get all sender rooms `http://127.0.0.1:8000/en/api/v1/chat/recieve/`

Example request
```http
GET http://127.0.0.1:8000/en/api/v1/chat/recieve/?first_user=2
```

Example responce
```json
{
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
        {
            "last_message": {
                "content": "аівсівм",
                "created_at": "2025-03-24T06:44:32.156598Z",
                "from_this_user": false
            }
        },
        {
            "last_message": {
                "content": "перемога",
                "created_at": "2025-03-25T12:36:37.439926Z",
                "from_this_user": false
            }
        },
        {
            "last_message": {
                "content": "redfbgfg",
                "created_at": "2025-04-03T14:28:22.747952Z",
                "from_this_user": false
            }
        },
        {
            "last_message": null
        }
    ]
}

```

### Delete chat room `http://127.0.0.1:8000/en/api/v1/chat/delete/<room_id>`

Example request
```http
DELETE http://127.0.0.1:8000/en/api/v1/chat/delete/90
```

Example response



## WebSocket Endpoints

### Connect
**Endpoint:** `ws://chat.house-community.site/ws/chat/?room_id=4/`

**Description:**
- Authenticates the user using a JWT token id token.
- Verifies if the user is part of the chat room.
- Joins the WebSocket group corresponding to the chat room.
- Loads the last 50 messages from the database and sends them to the client.
  
**Example method**

```javascript
    const socket = new WebSocket("ws://127.0.0.1:8001/ws/chat/?room_id13/", ["Bearer", jwt_token]);

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
        "text": "vrgrwq", 
        "message_id": 179, 
        "sender_id": 19639, 
        "status": "read", 
        "created_at": "2025-05-12T15:09:23.065265+00:00", 
        "updated_at": "2025-05-12T15:09:23.065283+00:00", 
        "attachments": []
    }, 
    {
        "text": "fewf", 
        "message_id": 180, 
        "sender_id": 15535, 
        "status": "read", 
        "created_at": "2025-05-12T15:09:31.260001+00:00", 
        "updated_at": "2025-05-12T15:09:31.260021+00:00", 
        "attachments": []
    }, 
    {
        "text": "frwfe", 
        "message_id": 181, 
        "sender_id": 19639, 
        "status": "read", 
        "created_at": "2025-05-12T15:09:43.577118+00:00", 
        "updated_at": "2025-05-12T15:09:43.577139+00:00", 
        "attachments": []
        }, 
    {
        "text": "fewewwe", 
        "message_id": 182, 
        "sender_id": 19639, 
        "status": "delivered", 
        "created_at": "2025-05-12T15:22:02.959298+00:00", 
        "updated_at": "2025-05-12T15:22:02.959319+00:00", 
        "attachments": [{
            "file_url": "https://s3olxclone.s3.amazonaws.com/media/chat_attachments/images/2025/05/12/Screenshot_2025-01-28_191925.png", 
            "file_name": "Screenshot_2025-01-28_191925.png", 
            "content_type": "image/png"
            }]
    }    
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

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Socket Chat</title>
    <style>
      body { margin: 0; padding-bottom: 5rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

      #form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
      #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
      #input:focus { outline: none; }
      #file-input { margin: 0.25rem; }
      #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; cursor: pointer; }
      #form > button:disabled { background: #666; cursor: not-allowed; }

      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages > li { padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: flex-start; }
      #messages > li:nth-child(odd) { background: #efefef; }
      .message-content { flex-grow: 1; }
      .message-content img { max-width: 200px; margin-top: 0.5rem; }
      .message-content a { color: blue; text-decoration: underline; }
      .delete-btn { background: none; border: none; color: red; font-size: 1rem; cursor: pointer; }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form id="form">
      <input id="input" autocomplete="off" placeholder="Type a message..." />
      <input id="file-input" type="file" accept="image/png,image/jpeg,image/gif,image/webp,application/pdf" />
      <button type="submit" id="send-button">Send</button>
    </form>
    <script>
      const socket = new WebSocket("ws://127.0.0.1:8001/ws/chat/?room_id=93", ["Bearer", token]);

      socket.onopen = function () {
        console.log("Подключено к WebSocket");
      };

      socket.onmessage = function (event) {
        console.log("Получено сообщение", event.data);
        const data = JSON.parse(event.data);

        if (data.type === "chat_message") {
          const message = data.message;
          addMessageToList(
            message.message_id,
            message.sender_id,
            message.text,
            message.attachments
          );
        } else if (data.type === "message_deleted") {
          removeMessageFromList(data.message_id);
        } else if (data.type === "message_edited") {
          updateMessageInList(data.message_id, data.text);
        } else if (data.type === "error") {
          alert(`Ошибка: ${data.message}`);
        } else if (data.type === "presigned_url") {
          // Получен presigned URL для загрузки файла в S3
          uploadFileToS3(data.presigned_url, data.file_path, data.message);
        }
      };

      socket.onerror = function (error) {
        console.error("Ошибка WebSocket:", error);
      };

      socket.onclose = function (event) {
        console.log("WebSocket закрыт:", event.code, event.reason);
      };

    document.getElementById("form").addEventListener("submit", function(e) {
        e.preventDefault();
        sendMessage();
    });

    function sendMessage() {
        const input = document.getElementById("input");
        const fileInput = document.getElementById("file-input");
        const sendButton = document.getElementById("send-button");
        const messageText = input.value.trim();
        const file = fileInput.files[0];

        if (!messageText && !file) {
            alert("Введите сообщение или выберите файл.");
            return;
        }

        sendButton.disabled = true;

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileData = e.target.result; // base64-строка
                const normalizedFileName = file.name.replace(/\s+/g, '_').replace(/[^\w\.-]/g, '');
                socket.send(JSON.stringify({
                    action: "send",
                    message: messageText,
                    file: {
                        name: normalizedFileName,
                        size: file.size,
                        type: file.type || "application/octet-stream",
                        data: fileData // Отправляем base64
                    }
                }));
                resetForm();
            };
            reader.readAsDataURL(file);
        } else {
            socket.send(JSON.stringify({
                action: "send",
                message: messageText,
                file: null
            }));
            resetForm();
        }

        function resetForm() {
            input.value = "";
            fileInput.value = "";
            sendButton.disabled = false;
        }
    }

      function deleteMessage(messageId) {
        socket.send(JSON.stringify({
          action: "delete",
          message_id: messageId,
        }));
      }

      function editMessage(messageId, newMessage) {
        socket.send(JSON.stringify({
          action: "edit",
          message_id: messageId,
          text: newMessage,
        }));
      }

      function addMessageToList(messageId, user, message, attachments = []) {
        const li = document.createElement("li");
        li.id = `msg-${messageId}`;
        const contentDiv = document.createElement("div");
        contentDiv.className = "message-content";

        if (message) {
          const textSpan = document.createElement("span");
          textSpan.innerHTML = `<b>${user}:</b> ${message}`;
          contentDiv.appendChild(textSpan);
        }

        attachments.forEach(attachment => {
          const fileUrl = attachment.file_url;
          if (fileUrl.includes(".png") || fileUrl.includes(".jpg") || fileUrl.includes(".jpeg") || fileUrl.includes(".gif") || fileUrl.includes(".webp")) {
            const img = document.createElement("img");
            img.src = fileUrl; // Используем presigned URL для чтения
            contentDiv.appendChild(img);
          } else {
            const link = document.createElement("a");
            link.href = fileUrl;
            link.textContent = "Download file";
            link.download = "";
            contentDiv.appendChild(link);
          }
        });

        li.appendChild(contentDiv);
        li.innerHTML += `<button class="delete-btn" onclick="deleteMessage('${messageId}')">🗑</button>`;
        document.getElementById("messages").appendChild(li);
      }

      function removeMessageFromList(messageId) {
        const messageElement = document.getElementById(`msg-${messageId}`);
        if (messageElement) {
          messageElement.remove();
        }
      }

      function updateMessageInList(messageId, newMessage) {
        const messageElement = document.getElementById(`msg-${messageId}`);
        if (messageElement) {
          const textSpan = messageElement.querySelector(".message-content span");
          if (textSpan) {
            const user = textSpan.querySelector("b").textContent;
            textSpan.innerHTML = `<b>${user}</b> ${newMessage}`;
          }
        }
      }
    </script>
  </body>
</html>

```