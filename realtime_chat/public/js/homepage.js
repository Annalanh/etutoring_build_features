let userList = [
    {
        id: 1,
        username: 'thao',
        rooms: [{partnername: 'hoa', roomname: 'thaohoa', partnerid: 4}, {partnername: 'khanh', roomname: 'thaokhanh', partnerid: 3}],
    },
    {
        id: 2,
        username: 'banhang',
        rooms: [{partnername: 'thao', roomname: 'thaobanhang', partnerid: 1}],
    },
    {
        id: 3,
        username: 'khanh',
        rooms: [{partnername: 'thao', roomname: 'thaokhanh', partnerid: 1}],
    },
    {
        id: 4,
        username: 'hoa',
        rooms: [{partnername: 'thao', roomname: 'thaohoa', partnerid: 1}],
    },
    {
        id: 5,
        username: 'trang',
        rooms: [],
    },
    {
        id: 6,
        username: 'my',
        rooms: [{partnername: 'khanh', roomname: 'mykhanh', partnerid: 3}],
    }
]

//elements
let $manageChatBoxContainer = document.getElementById('manage-chatbox-container')
let $chatboxContainer = document.getElementById('chatbox-container')
let $messageForm = document.querySelector("#message-form")
let $roomSender = document.getElementById('room-sender')
let $messageFormInput = document.querySelector('input')
let $onlineNumber = document.querySelector('#online-number')
let $chatRoom = document.querySelector('#chat-room')
let $closeChatRoom = document.querySelector('#close-chat-room')
let $newChat = document.querySelector("#new-chat")

let id = localStorage.getItem('userId')
let currentUser = userList.find(user => user.id == id)
let currentUserRooms = currentUser.rooms

renderChatBoxes(currentUserRooms)

//open/hide chat box container
$manageChatBoxContainer.addEventListener('click', (e) => {
    if(e.target.checked){
        $chatboxContainer.style.display = 'block'
    }else{
        $chatboxContainer.style.display = 'none'
    }
})
$closeChatRoom.addEventListener('click', (e) => {
    $chatRoom.style.display = 'none'
})
//render one chatbox
function renderChatBox(room){
    let roomName = room.roomname
    console.log(roomName)
    let partnerName = room.partnername
    let partnerId = room.partnerid

    let chatBoxSender = document.createElement('div')
    chatBoxSender.setAttribute('class', 'chatbox-sender')
    chatBoxSender.innerHTML = partnerName;

    let recentMessage = document.createElement('div')
    recentMessage.setAttribute('class', 'recent-message')

    let chatBox = document.createElement('div')
    chatBox.setAttribute('class', 'chatbox')
    chatBox.setAttribute('room', roomName)

    chatBox.appendChild(chatBoxSender)
    chatBox.appendChild(recentMessage)
    $chatboxContainer.appendChild(chatBox)

    chatBox.addEventListener('click', (e) => {
        $roomSender.innerText = partnerName
        $messageFormInput.setAttribute('partner-id', partnerId)
        $messageFormInput.setAttribute('room', roomName)
        $chatRoom.style.display = 'block'
    })
}
//render chat boxes
function renderChatBoxes(rooms){
    rooms.forEach(room => {
        renderChatBox(room)
    })
}

function updateOnlineNumber(status){
    let currentOnlineNumber = parseInt($onlineNumber.innerText);

    if(status){
        $onlineNumber.innerText = currentOnlineNumber+=1;
    }else{
        $onlineNumber.innerText = currentOnlineNumber-=1;
    }
}



//create socket
let socket = io()

socket.emit('joinOnlineList', currentUser)

currentUserRooms.forEach(room => {
    socket.emit('joinRoom', {id: currentUser.id, room: room.roomname, partnername: room.partnername, partnerid: room.partnerid})
})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit("sendMessage", {message: e.target.elements.message.value, room: $messageFormInput.getAttribute('room') })
})
$newChat.addEventListener('submit', (e) => {
    e.preventDefault()
    let newPartnerName = e.target.elements.newpartner.value
    let newPartner = userList.find(user => user.username == newPartnerName)
    let newPartnerId = newPartner.id
    socket.emit("createNewRoom", {id: currentUser.id, partnerid: newPartnerId }, (roomname) => {
        renderChatBox({partnername: newPartnerName, roomname, partnerid: newPartnerId})
        const index = userList.findIndex((user) => user.id === currentUser.id)
        userList[index].rooms.push({
            partnername: newPartnerName,
            roomname,
            partnerid: newPartnerId
        })
    })
})
socket.on('message', (msg) => {
    let allChatBox = [...document.getElementsByClassName('chatbox')]
    let receivedChatBox = allChatBox.find(chatBox => chatBox.getAttribute('room') === msg.room)
    receivedChatBox.querySelector('.recent-message').innerText = msg.message
})
socket.on('onlinePartner', ({status, room}) => {
    updateOnlineNumber(status)
})
socket.on('online', ({status}) => {
    updateOnlineNumber(status)
})
socket.on('newChatRequest', ({id, roomname, partnerid, partnername}) => {
    if(id == currentUser.id){
        socket.emit('acceptChatRequest', roomname, () => {
            renderChatBox({ partnername, roomname, partnerid })
        })
    }
})

