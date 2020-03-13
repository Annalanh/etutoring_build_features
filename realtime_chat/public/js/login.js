//danh sách user.
let userList = [
    {
        id: 1,
        username: 'thao',
        rooms: [],
    },
    {
        id: 2,
        username: 'banhang',
        rooms: [],
    },
    {
        id: 3,
        username: 'khanh',
        rooms: [],
    },
    {
        id: 4,
        username: 'hoa',
        rooms: [],
    },
    {
        id: 5,
        username: 'trang',
        rooms: [],
    },
    {
        id: 6,
        username: 'my',
        rooms: [],
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
