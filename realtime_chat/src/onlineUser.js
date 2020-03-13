let onlineUsers = []

function addUser(user){
    onlineUsers.push(user)
}
function removeUser(id){
    const index = onlineUsers.findIndex((onlineUser) => onlineUser.socketid === id)

    if(!index !== -1){
        return onlineUsers.splice(index,1)[0]
    }
}
function getUser(id){
    return onlineUsers.find(onlineUser => onlineUser.id == id)
}
function addNewRoomOnline({roomname, id, partnerid, partnername}){
    const index = onlineUsers.findIndex((onlineUser) => onlineUser.id === id)
    onlineUsers[index].rooms.push({
        partnername,
        roomname,
        partnerid
    })
}
module.exports = {
    onlineUsers,
    addUser,
    removeUser,
    getUser,
    addNewRoomOnline
}