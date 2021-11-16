import React, { useEffect, useRef } from 'react';
import './App.css';
import { Joystick } from 'react-joystick-component';
import io from 'socket.io-client'



/* ================== 조이스틱 관련 시작 ================== */
type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

interface IJoystickUpdateEvent {
  type: "move" | "stop" | "start";
  x: number | null;
  y: number | null;
  direction: JoystickDirection | null;
}

const handleMove = (event: IJoystickUpdateEvent) => {
  const x: number | null = event.x;
  const y: number | null = event.y;
  joystickData.state = event.type;

  if (x != null && y != null) {
    joystickData.moveX = x / 50;
    joystickData.moveY = y / -50;
  }
}

const handleStop = (event: IJoystickUpdateEvent) => {
  joystickData.state = event.type;
}

/* ================== 조이스틱 관련 끝 ================== */

class playerBall {
  id: string;
  color: string;
  x: number;
  y: number;

  constructor() {
    this.id = "";
    this.color = "#FF00FF";
    this.x = 360/2;
    this.y = 500/2;
  }
}

type playerBallType = {
  id: string;
  color: string;
  x: number;
  y: number;
}

type dataToServer = {
  id: string;
  x: number;
  y: number;
}

/* ================== 게임 정보 관련 시작 ================== */
//Note: 현재 픽셀 위치 설정은 canvas 360x500을 기준으로 맞춰져있습니다.
const CanvasWidth = 360;
const CanvasHeight = 500;
const ballRad = 20;

const balls: playerBallType[] = [];
const ballMap: Record<string, playerBall> = {};
let myId: string;



const joystickData = {
  moveX: 0,
  moveY: 0,
  state: "stop",
}

function joinUser(id: string, color: string, x: number, y: number){
  console.log("join user");
  let ball = new playerBall();
  ball.id = id;
  ball.color = color;
  ball.x = x;
  ball.y = y;

  balls.push(ball);
  ballMap[id] = ball;

  return ball;
}

function leaveUser(id: string){
  for(var i = 0 ; i < balls.length; i++){
      if(balls[i].id === id){
          balls.splice(i,1);
          break;
      }
  }
  delete ballMap[id];
}

function updateState(id: string, x: number, y: number){
  for(let i = 0 ; i < balls.length; i++){
    if(balls[i].id === id) {
      balls[i].x = x;
      balls[i].y = y;
      break;
    }
  }

  let ball = ballMap[id];
  if(!ball){
      return;
  }
  ball.x = x;
  ball.y = y;
}

/* ================== 게임 정보 관련 끝 ================== */

/* ================== 서버 관련 시작 ================== */
const socket = io('http://localhost:3000');

socket.on('user_id', function(data){
  myId = data;
});

socket.on('join_user', function(data){
  joinUser(data.id, data.color, data.x, data.y);
})

socket.on('leave_user', function(data){
  leaveUser(data);
})

socket.on('update_state', function(data){
  updateState(data.id, data.x, data.y);
})

function sendData() {
  let curPlayer = ballMap[myId];
  let data: dataToServer = {
    id: curPlayer.id,
    x: curPlayer.x,
    y: curPlayer.y
  }
  if(data){
      socket.emit("send_location", data);
  }
}
/* ================== 서버 관련 끝 ================== */

/* ================== 캔버스 출력 관련 시작 ================== */

function ClearCanvas(ctx: any, canvas: any) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// function drawCircle(ctx: any) {
//   ctx.fillStyle = "red";
//   ctx.beginPath();
//   ctx.arc(x, y, ballRad, 0, 2 * Math.PI);
//   ctx.fill();
//   ctx.stroke();
// }

/* ================== 캔버스 출력 관련 끝================== */

function App() {
  //canvas 사용을 위해 필요한 선언 1
  const canvasRef: any = useRef(null);

  useEffect(() => {
    const render = () => {
      //canvas 사용을 위해 필요한 선언 2
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      /*==== 캔버스 요소 조작 시작====*/
      ClearCanvas(ctx, canvas);

      for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];
        
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRad, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }

      /*==== 캔버스 요소 조작 끝====*/

      let curPlayer = ballMap[myId];
      // console.log(curPlayer);

      if (joystickData.state === "move"){
        curPlayer.x += joystickData.moveX;
        curPlayer.y += joystickData.moveY;
        sendData();
      } else if (joystickData.state === "stop"){
        joystickData.moveX = 0;
        joystickData.moveY = 0;
      }

      // sendData();

      //canvas에 애니메이션이 작동하게 하는 함수. 
      requestAnimationFrame(render);
    };

    // setInterval(render, 10);
    render();
  });

  return (
    <div className="hotBombPotato">
      <canvas
        id="canvas"
        ref={canvasRef}
        height={CanvasHeight}
        width={CanvasWidth} />
      <div className="joystick">
        <Joystick 
          size={100} 
          baseColor="red" 
          stickColor="blue" 
          move={handleMove} 
          stop={handleStop}
          throttle={120}
        >
        </Joystick>
      </div>
    </div>
  );
}

export default App;
