const express = require('express');
const app = express();
const server = require('http').createServer(app);
const {Server} = require('socket.io')
const io = new Server(server);
const path = require('path');
const bomb = require('./bomb');

server.listen(3000, ()=>{
    console.log('3000 port ON!');
})

app.use(express.static(path.join(__dirname, "../../build")));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../','../','build/index.html'));
})

//bomb 게임 통신
io.on('connection', (socket)=>{
    bomb(io, socket);
})