//danh sách user.
let userList = [
    {
        id: 1,
        username: 'thao',
        chat: {private: [2,3], group: []},
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
document.getElementById("login-form").addEventListener('submit', (e) => {
    e.preventDefault()
    let currentUser = userList.find(user => user.username === e.target.username.value)
    if(currentUser){
        localStorage.setItem("userId", currentUser.id);
        location.href = "/homepage.html"

    }else{
        alert('Người dùng không tồn tại')
    }
})
