// 前端页面的 JS 文件
// 代表：客户端

const params = Qs.parse(location.search, { ignoreQueryPrefix: true });

document.getElementById('room').innerHTML += `
    <li class="list-group-item">${params.room}</li>
`;

// 作为客户端和服务端建立 WebSocket 连接
const socket = io(); // io 变量由 Socket.IO 的 JS 提供


// 告知 server 自己的名字以及所加入的房间
socket.emit("joinRoom", {
    name: params.name,
    room: params.room
})

// 在消息输入框 DOM 上监听提交事件
document.getElementById('input-form').addEventListener('submit', e => {
    e.preventDefault();

    const inputEl = document.getElementById('msg');
    const msg = inputEl.value;
    inputEl.value = '';

    if (!msg) {
        return;
    }

    // 渲染到页面上
    document.querySelector('.msg-container').innerHTML +=
        `
            <div class="d-flex justify-content-end m-3">
                <div class="card w-50 bg-success bg-gradient text-white">
                    <div class="card-body">
                        <span class="card-title"><b>我&nbsp;&nbsp;&nbsp;${new Date().toLocaleTimeString()}</b></span>
                        <div class="card-text">${msg}</div>
                    </div>
                </div>
            </div>
        `;
    scroll();

    // 向 server 发送聊天消息
    socket.emit('chatMessage', {
        name: params.name,
        content: msg
    });
});

// --------- 监听 WebSocket 连接 -----------

// 监听系统消息
socket.on("sysMessage", message => {
    console.log(message);
});

// 监听聊天消息
socket.on("chatMessage", message => {
    const name = message.name;
    const content = message.content;
    console.log(name + " 在房间发消息：" + content);
    if (name !== params.name) {
        // 渲染到页面上
        document.querySelector('.msg-container').innerHTML +=
            `
            <div class="d-flex justify-content-start m-3">
                <div class="card w-50">
                    <div class="card-body">
                    <span class="card-title"><b>${name}&nbsp;&nbsp;&nbsp;${new Date().toLocaleTimeString()}</b></span>
                        <div class="card-text">${content}</div>
                    </div>
                </div>
            </div>
            `;
        scroll();
    }
});

// 监听房间内的成员变化
socket.on("memberChange", users => {
    // 修改页面上的信息
    const userListEl = document.querySelector('.member-list');
    while (userListEl.childNodes.length > 3) {
        userListEl.removeChild(userListEl.lastChild);
    }
    let listHtml = "";
    users.map(user => {
        listHtml += `<li class="list-group-item">${user.name}</li>`;
    })
    userListEl.innerHTML += listHtml;
});


// 滚动函数：保持消息窗口永远在最下面
function scroll() {
    const right_panel = document.querySelector('.right-panel');
    const msg_container = document.querySelector('.msg-container');
    right_panel.scrollTop = msg_container.scrollHeight;
}