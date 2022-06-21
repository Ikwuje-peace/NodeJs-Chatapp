const path = require('path')
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)
const PORT = 3000 || process.env.PORT
const formatMessage = require('./utils/messages')
const botname = "Yetti"

//Set Static folder
app.use(express.static(path.join(__dirname, 'html-css')))

//Runs when a client connects
io.on('connection', socket =>{
    // Welcomes the current user
    socket.emit('message', formatMessage(botname,'Welcome to YettiChat')); // This is to just the single client

    // Send a broadcast message when a user connects
    socket.broadcast.emit('message', formatMessage(botname,'Another User joined the chat')); //This sends a broadcast to everyone using the chat app except the one that joined the chat

    //Runs when a client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botname,'A user left the chat room'))//io.emit()// This is to all the clients in general
    })
    //Listen for chatMessage
    socket.on('chatMessage', msg =>{
        console.log(msg)
        io.emit('message',formatMessage('USER', msg))
    })
})

server.listen(PORT, ()=> console.log(`The server is running on port ${PORT}`));