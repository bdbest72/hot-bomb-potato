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

let ballColor = ['red','blue','green','yellow','orange','purple','white','black'] //8 color setting

const startX = 360;
const startY = 500;

class PlayerBall{
    constructor(socket){
        this.socket = socket;
        this.x = 0;
        this.y = 0;
        this.color = 'red';
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

//client 연결시 아래 코드 안에서 통신함
io.on('connection', (socket)=>{
    console.log(`${socket.id} is entered ${Date()}`);

    //연결 종료시 작업
    socket.on('disconnect', (reason)=>{
        console.log(socket.id + ' has left because of ' + reason + ' ' + Date());
        endGame(socket);
        socket.emit('leave_user', socket.id); //떠날 때 socket.id 값 송신
    })

    //게임에 필요한 ball생성 작업
    let newBall = joinGame(socket);
    socket.emit('user_id', socket.id); //접속한 socket.id 송신

    //생성된 ball들의 기초 정보 전송
    for(var i=0; i < balls.length; i++){
        let ball = balls[i];
        socket.emit('join_user',{
            id: ball.id,
            x: 140 + 80*(i%2) ,
            y: 100 + 100*parseInt(i/2),
            color: ballColor[i],
        });
    }

    //업데이트된 위치 정보 받아서
    socket.on('send_location', data =>{
        //각 클라이언트로 위치 정보 전송
        socket.emit('update_state',{
            id: data.id,
            x: data.x,
            y: data.y,
        })
    });
})