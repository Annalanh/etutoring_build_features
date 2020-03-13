let users = [
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
function getUserById(id){
    return users.find(user => user.id === id)
}
module.exports = {
    getUserById,
    users
}
