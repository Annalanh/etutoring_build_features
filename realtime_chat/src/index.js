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

let emptyRoom = 0;
io.on('connection', (socket) => {
    socket.on('joinOnlineList', ({id, username, rooms}) => {
        addUser({
            id, 
            username,
            rooms,
            socketid: socket.id
        })
    })

    socket.on('sendMessage', (msg, callback) => {
        io.to(msg.room).emit('message', { message: msg.message, room: msg.room })
    })

    socket.on('joinRoom', ({id, room, partnername, partnerid }) => {
        socket.join(room)

        socket.broadcast.to(room).emit('online', {status: true})
        let partner = onlineUsers.find(onlineUser => onlineUser.id == partnerid)
        if(partner){
            socket.emit('onlinePartner', {status: true})
        }
    })

    socket.on("createNewRoom", ({id, partnerid}, callback) =>{
        //lấy thông tin của mình
            let currentUser = getUserById(id)
        //tìm partner đó đã có room nào với mình chưa
            let newPartner = getUserById(partnerid)
            let roomWithCurrentUser = newPartner.rooms.find(room => room.partnerid == id)
            let onlinePartner = getUser(partnerid)

            if(roomWithCurrentUser){
                //join room 
                socket.join(roomWithCurrentUser.roomname)
                //check xem partner có online không
                // if(onlinePartner) socket.emit("onlinePartner", {status: true})
                //thêm chatbox cho partner mới và thêm vào db của mình room mới
                callback(roomWithCurrentUser.roomname)
                //thêm vào useronline của mình room mới
                addNewRoomOnline({partnername: newPartner.username, id: id, partnerid: newPartner.id, roomname: roomWithCurrentUser.roomname})
            }else{
                console.log('hello')
                //nếu chưa có thì join mình và partner vào #emptyRoom
                let newRoom = `room${emptyRoom}`
                socket.join(newRoom)
                callback(newRoom)
                io.emit('newChatRequest', { id: partnerid, roomname: newRoom, partnername: currentUser.username, partnerid: id })   
                //thêm vào db của mình và partner room mới, thêm vào useronline của mình(và partner nếu partner online) room mới
                emptyRoom+=1;
            }
            if(onlinePartner) socket.emit("onlinePartner", {status: true})

    })
    socket.on('acceptChatRequest', (roomname, callback) =>{
        socket.join(roomname)
        callback()
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            const rooms = user.rooms
            rooms.forEach( room => {
                io.to(room.roomname).emit('online', {status: false})
            });
        }
    })
})



server.listen(3000)