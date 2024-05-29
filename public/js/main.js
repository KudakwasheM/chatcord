const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const userList = document.querySelector("#users");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username, room);

const socket = io();

// Join chat room
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //   Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //   Get message text
  const msg = e.target.elements.msg.value;

  //   Emit message to chat
  socket.emit("chatMessage", msg);

  //   Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to dom
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>
    `;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to dom
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to room
function outputUsers(users) {
  userList.innerHTML = `
    ${users
      .map(
        (user) => `
    <li>${user.username}</li>
    `
      )
      .join("")}
    `;
}
