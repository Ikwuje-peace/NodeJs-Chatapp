const path = require('path')
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)
const PORT = 3000 || process.env.PORT
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser} = require('./utils/users')

const botname = "Yetti"

//Set Static folder
app.use(express.static(path.join(__dirname, 'html-css')))

//Runs when a client connects
io.on('connection', socket =>{
    socket.on('joinRoom', ({username, room}) =>{

        const user = userJoin(socket.id, username, room)

        socket.join(user.room)
         // Welcomes the current user
        socket.emit('message', formatMessage(botname,'Welcome to YettiChat')); // This is to just the single client

        // Send a broadcast message when a user connects to the specific room
        socket.broadcast.to(user.room).emit('message', formatMessage(botname,`${user.username} joined the chat`)); //This sends a broadcast to everyone using the chat app except the one that joined the chat

    })
    //Listen for chatMessage
    socket.on('chatMessage', msg =>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(`${user.username}`, msg))
    })
     //Runs when a client disconnects
     socket.on('disconnect', () => {
        io.emit('message', formatMessage(botname,'A user left the chat room'))//io.emit()// This is to all the clients in general
    })
})

server.listen(PORT, ()=> console.log(`The server is running on port ${PORT}`));