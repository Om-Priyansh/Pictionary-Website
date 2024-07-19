const users = [];

const addUser = ({name, userId, roomId, host, presenter, socketId}) => {
    const user = {name, userId, roomId, host, presenter, socketId};
    users.push(user);
    return users.filter((user) => user.roomId == roomId);
};

const removeUser = (id) =>{
    const index = users.findIndex((user) => user.socketId == id);
    // console.log(index)
    if(index != -1){
        return users.splice(index, 1)[0];
    }
    
};

const getUser = (id) =>{
    // console.log(users.find((user) =>user.socketId == id));
    return (users.find((user) =>user.socketId == id));
};

const getUsersInRoom = (roomId) =>{
    return users.filter((user) => user.roomId ==roomId) ;
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};


