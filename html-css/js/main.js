const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages')

//Get Username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket =  io();

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