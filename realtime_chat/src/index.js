const express = require('express')
const app = express()
const http = require('http')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)
const path = require('path')
const publicDirectoryPath = path.join(__dirname, '../public')
const {onlineUsers, addUser, removeUser, getUser, addNewRoomOnline} = require('./onlineUser')
const { users, getUserById } = require('./users')
app.use(express.static(publicDirectoryPath))

let emptyGroupId = 0;
io.on('connection', (socket) => {
    let currentUser = {}
    socket.on('joinOnlineList', ({id, username, chat}) => {
        currentUser = {
            id, 
            username,
            chat,
            socketid: socket.id
        }
        addUser(currentUser)
    })

    socket.on('sendMessage', (msg, callback) => {
        console.log(onlineUsers)
        let partnerId = msg.partnerid
        let message = msg.message

        let partner = getUser(partnerId)
        if(partner){
            console.log('gui cho partner dang online')
            let partnerSocketId = partner.socketid
            io.to(`${partnerSocketId}`).emit('message', { message, partnerid: currentUser.id })
        }
    })
    socket.on('disconnect', () => {
        removeUser(socket.id)
    })
    // socket.on('createNewGroupChat', ({groupname, members}) => {
    //     socket.join(emptyGroupId)
    //     socket.emit('joinNewGroupChat', {groupname, groupid: emptyGroupId})
    //     members.forEach(membername => {
    //         let member = onlineUsers.find(user => user.username == membername)
    //         if(member){
    //             socket.broadcast.to(`${member.socketid}`).emit('joinNewGroupChat', {groupname, groupid: emptyGroupId})
    //         }
    //     });
    //     emptyGroupId+=1
    // })
})



server.listen(3000)