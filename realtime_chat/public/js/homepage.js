let userList = [
    {
        id: 1,
        username: 'thao',
        chat: {private: [2,3], group: [{name: "DiChoi", member: []}]},
    },
    {
        id: 2,
        username: 'banhang',
        chat: {private: [1], group: []},
    },
    {
        id: 3,
        username: 'khanh',
        chat: {private: [1], group: []},
    }
]

//elements
let $manageChatBoxContainer = document.getElementById('manage-chatbox-container')
let $chatboxContainer = document.getElementById('chatbox-container')
let $messageForm = document.querySelector("#message-form")
let $roomSender = document.getElementById('room-sender')
let $messageFormInput = document.querySelector('#partner-id')
let $onlineNumber = document.querySelector('#online-number')
let $chatRoom = document.querySelector('#chat-room')
let $closeChatRoom = document.querySelector('#close-chat-room')
let $newChat = document.querySelector("#new-chat")
let $newGroup = document.querySelector("#new-group")
let $newGroupName = document.querySelector("#new-group-name")
let $newGroupMember = document.querySelector("#new-group-member")

let id = localStorage.getItem('userId')
let currentUser = userList.find(user => user.id == id)
let currentUserChats = currentUser.chat

renderChatBoxes(currentUserChats)

// //open/hide chat box container
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
$newGroup.addEventListener('submit', (e) => {
    e.preventDefault()
    let members = $newGroupMember.value.trim().split(",")
    let groupName = $newGroupName

    socket.emit('createNewGroupChat', {groupname: groupName, members})
})
//render one chatbox
function renderChatBox(partnerId){
    let partner = findPartnerById(partnerId)
    let partnerName = partner.username

    let chatBoxSender = document.createElement('div')
    chatBoxSender.setAttribute('class', 'chatbox-sender')
    chatBoxSender.innerHTML = partnerName;

    let recentMessage = document.createElement('div')
    recentMessage.setAttribute('class', 'recent-message')

    let chatBox = document.createElement('div')
    chatBox.setAttribute('class', 'chatbox')
    chatBox.setAttribute('partner-id', partnerId)

    chatBox.appendChild(chatBoxSender)
    chatBox.appendChild(recentMessage)
    $chatboxContainer.appendChild(chatBox)

    chatBox.addEventListener('click', (e) => {
        $roomSender.innerText = partnerName
        $messageFormInput.setAttribute('partner-id', partnerId)
        $chatRoom.style.display = 'block'
    })
    return chatBox;
}
// //render chat boxes
function renderChatBoxes(chats){
    let privateChats = chats.private;
    // let groupChats = chats.group;

    privateChats.forEach(partnerId => {
        renderChatBox(partnerId)
    });
    // groupChats.forEach(groupChat => {
    //     let groupName = groupChat.name;
    //     let groupMembers = groupChat.member

    //     renderChatBox(groupName)
    // })
}
function findPartnerById(partnerId){
    return userList.find(user => user.id == partnerId)
}
// function renderGroupChatBox({groupid, groupname}){
//     let chatBoxSender = document.createElement('div')
//     chatBoxSender.setAttribute('class', 'chatbox-sender')
//     chatBoxSender.innerHTML = groupname;

//     let recentMessage = document.createElement('div')
//     recentMessage.setAttribute('class', 'recent-message')

//     let chatBox = document.createElement('div')
//     chatBox.setAttribute('class', 'chatbox')
//     chatBox.setAttribute('group-id', groupid)

//     chatBox.appendChild(chatBoxSender)
//     chatBox.appendChild(recentMessage)
//     $chatboxContainer.appendChild(chatBox)

//     chatBox.addEventListener('click', (e) => {
//         $roomSender.innerText = partnerName
//         $messageFormInput.setAttribute('group-id', groupid)
//         $chatRoom.style.display = 'block'
//     })
//     return chatBox;
// }

// function updateOnlineNumber(status){
//     let currentOnlineNumber = parseInt($onlineNumber.innerText);

//     if(status){
//         $onlineNumber.innerText = currentOnlineNumber+=1;
//     }else{
//         $onlineNumber.innerText = currentOnlineNumber-=1;
//     }
// }



//create socket
let socket = io()

socket.emit('joinOnlineList', currentUser)

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let partnerId = $messageFormInput.getAttribute('partner-id')
    let message = e.target.elements.message.value
    let allChatBox = [...document.getElementsByClassName('chatbox')]
    let receivedChatBox = allChatBox.find(chatBox => chatBox.getAttribute('partner-id') == partnerId)
    receivedChatBox.querySelector('.recent-message').innerText = message

    socket.emit("sendMessage", {message, partnerid: partnerId})

})

$newChat.addEventListener('submit', (e) => {
    e.preventDefault()
    let newPartnerName = e.target.elements.newpartner.value
    let newPartner = userList.find(user => user.username == newPartnerName)
    let newPartnerId = newPartner.id

    renderChatBox(newPartnerId)
})

socket.on('message', (msg) => {
    console.log(msg)
    let allChatBox = [...document.getElementsByClassName('chatbox')]
    let receivedChatBox = allChatBox.find(chatBox => chatBox.getAttribute('partner-id') == msg.partnerid)
    if(receivedChatBox){
        receivedChatBox.querySelector('.recent-message').innerText = msg.message
    }else{
        let newChatBox = renderChatBox(msg.partnerid)
        newChatBox.querySelector('.recent-message').innerText = msg.message
    }
    
})
// socket.on('joinNewGroupChat', ({groupname, groupid}) => {
//     renderGroupChatBox({groupname, groupid})
// })

// socket.on('onlinePartner', ({status, room}) => {
//     updateOnlineNumber(status)
// })
// socket.on('online', ({status}) => {
//     updateOnlineNumber(status)
// })


