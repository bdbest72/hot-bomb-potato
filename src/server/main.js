const express = require('express');
const app = express();
const server = require('http').createServer(app);
const {Server} = require('socket.io')
const io = new Server(server);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

server.listen(8000, ()=>{
    console.log('8000 port ON!');
})

app.get('/',(req,res)=>{
    res.send('god Damn')
})

function getPlayerColor(){
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}


const startX = 360;
const startY = 500;

class PlayerBall{
    constructor(socket){
        this.socket = socket;
        this.x = Math.floor(startX * Math.random());
        this.y = Math.floor(startY * Math.random());
        this.color = getPlayerColor();
    }

    get id() {
        return this.socket.id;
    }
}

io.on('connection', (socket)=>{
    console.log(`${socket.id} is entered`);

    let newBall = new PlayerBall(socket)
})