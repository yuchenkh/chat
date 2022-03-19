// 用于管理 server 当前服务的所有用户

const users = [];

function userJoin(id, name, room) {
    const u = { id, name, room }
    users.push(u);

    return u;
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index != -1) {
        return users.splice(index, 1);
    }
}

module.exports = {
    userJoin,
    userLeave,
    getRoomUsers
};