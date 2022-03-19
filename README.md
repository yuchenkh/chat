# Chat：聊天室
跟着 [视频](https://www.bilibili.com/video/BV1cv411K7Ti?spm_id_from=333.999.0.0) 做的一个基于 Node.js 的简单的聊天室应用。

## 用户界面
用户界面使用 Bootstrap 5 提供的组件和样式，配合传统的三大件：HTML、CSS 和 JS 搭建。主要使用到了 Bootstrap 的表单 (form) 和卡片 (card) 组件。


## 服务端
服务端主要运用以下组件：
* 使用 [Socket.IO](https://socket.io/) 实现客户端（浏览器）和服务端（Node.js）之间的通信。Socket.IO 所提供的功能基于 WebSocket 网络传输协议。
* 使用 [Express](https://expressjs.com/) 作为 Web 服务器，将用户界面作为服务提供给客户端。Express 是一个运行在 Node.js 上的简单快速的 Web 应用框架。
* 使用 [nodemon](https://nodemon.io/) 实现代码的热加载。
