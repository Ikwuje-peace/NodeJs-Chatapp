const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById("room-name")
const userList = document.getElementById('users')

//Get Username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket =  io();

// Get room and users
socket.on('roomUsers',({ room, users}) =>{
    outputRoomName(room)
    outputUsers(users)
})

// Join chat room
socket.emit('joinRoom', {username, room})

// Message from server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    // Scroll down by default after every message is sent 
    chatMessage.scrollTop = chatMessage.scrollHeight
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get the message text
    const msg = e.target.elements.msg.value;

    //Emits message to the server
    socket.emit('chatMessage',msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Output Room to DOM
function outputRoomName(room){
    roomName.innerText = room

}
// Output Users to DOM
function outputUsers(users){
    userList.innerHTML = `${users.map(user =>`<li>${user.username}</li>`).join('')}`
}