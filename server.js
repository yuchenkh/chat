// Node 应用的入口文件
// 服务端

// 引入依赖模块
const express = require('express');
const socketio = require('socket.io');
const { userJoin, userLeave, getRoomUsers } = require('./users');

const http = require('http');
const path = require('path'); // Node.js 提供的一个模块



// 创建一个 Express 应用实例
const app = express();

// 创建一个 Server，并把上面的 Express 应用作为参数传入
const server = http.createServer(app);

// 让 app 挂载静态资源
const public_path = path.join(__dirname, 'public'); // 静态资源路径
app.use(express.static(public_path));

// 让 server 在指定端口监听
const PORT = process.env.PORT || 9527; // 定义 Express 的监听端口
server.listen(PORT, () => {
    console.log('This server is running on port ' + PORT);
})

// ------------ Socket.IO -------------

// 创建一个 Socket.IO 应用，并把 server 传入
const io = socketio(server);

// 让 Socket 应用监听连接事件
io.on("connection", (socket) => {
    socket.on("joinRoom", ({ name, room }) => {
        console.log(name + " 进入聊天室：" + room);
        socket.emit("sysMessage", "欢迎加入聊天室：" + room); // 使用接收到这个事件的连接 socket 向客户端发送欢迎消息
        socket.join(room); // 将这个 client 划分到指定 room
        userJoin(socket.id, name, room); // 将这个用户的信息保存起来
        io.to(room).emit("memberChange", getRoomUsers(room)); // 将当前房间里的成员信息广播出去
        // 监听聊天消息
        socket.on("chatMessage", message => {
            console.log(message.name + " 说：" + message.content);
            // 将这条消息转发给房间内的所有客户（使用 io，即全局连接推送给这个房间里的所有人）
            io.to(room).emit("chatMessage", message);
        });
        // 监听用户离开事件
        socket.on("disconnect", () => {
            userLeave(socket.id);
            io.to(room).emit("memberChange", getRoomUsers(room));
            console.log(name + " 退出聊天室：" + room);
        });
    });
})