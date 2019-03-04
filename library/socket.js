// var WebSocketServer = require('ws').Server;
// var socket = new WebSocketServer({
//     port: 8888
// });

//主函数
// function socketRun() {
//     socket.on('connection', function connection(ws) {

//         ws.on('message', function incoming(message) {
//             console.log('received: %s', message);
//         });
//         // setInterval(() => {
//         //     ws.send('hello how are you');
//         // }, 5000);

//     })
// }

// module.exports = socketRun;

const fun = require('../config/fun.js');
const alllinks = {};

//主函数
function socketRun(server) {
    const io = require('socket.io')(server,{
        path: '/socket',
        transports: ['websocket']
    });
    //加入连接
    io.on('connection', function (socket) {

        //监听用户连接
        socket.on('join', function (userId) 
        {
            userId = fun.decodeStr(userId);
            alllinks[userId] = socket.id;  //把socketid存到全局对象里面去
        });

        //私聊：服务器接受到私聊信息，发送给目标用户
        socket.on('private_message', function (data)
        {
            var msg = JSON.parse(data);
            msg.from = fun.decodeStr(msg.from);
            var target = alllinks[msg.to];
            if (io.sockets.connected[target]) {
                var r_msg = {
                    from: msg.from,
                    to: msg.to,
                    text: msg.text,
                    type: 1  //文本信息
                }
                r_msg = JSON.stringify(r_msg);
                io.sockets.connected[target].emit('server_message',r_msg);
            }
        });
        

    })
}

module.exports = socketRun;