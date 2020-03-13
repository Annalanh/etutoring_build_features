let users = [
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
function getUserById(id){
    return users.find(user => user.id === id)
}
module.exports = {
    getUserById,
    users
}
