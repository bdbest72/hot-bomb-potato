const express = require('express');
const app = express();
const server = require('http').createServer(app);
const {Server} = require('socket.io')
const io = new Server(server);
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

server.listen(3000, ()=>{
    console.log('3000 port ON!');
})

app.use(express.static(path.join(__dirname, "../../build")));

app.get('/',(req,res)=>{
    res.sendFile(path.join('../','../','build/index.html'));
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

var balls = [];
var ballMap = {};

function joinGame(socket){
    let ball = new PlayerBall(socket);

    balls.push(ball);
    ballMap[socket.id] = ball;

    return ball;
}

function endGame(socket){
    for(var i=0; i<balls.length; i++){
        if(balls[i].id === socket.id){
            balls.splice(i,1);
            break
        }
    }
    delete ballMap[socket.id];
}

io.on('connection', (socket)=>{
    console.log(`${socket.id} is entered ${Date()}`);

    socket.on('disconnect', (reason)=>{
        console.log(socket.id + ' has left because of ' + reason + ' ' + Date());
        endGame(socket);
    })

    let newBall = joinGame(socket);

    for(var i=0; i < balls.length; i++){
        let ball = balls[i];
        socket.emit('join_user',{
            id: ball.id,
            x: ball.x,
            y: ball.y,
            color: ball.color,
        });
    }

    socket.on('send_location', data =>{
        socket.emit('update_state',{
            id: data.id,
            x: data.x,
            y: data.y,
        })
    })
})
