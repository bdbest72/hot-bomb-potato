import React, { useEffect, useRef } from 'react';
import './App.css';
import { Joystick } from 'react-joystick-component';
import isWallCollision from './isWallCollision';
import io from 'socket.io-client'

/* ================== 서버 관련 시작 ================== */
const socket = io('http://localhost:3000');

socket.on('join_user', function(data){
  gameData.x = data.x;
  gameData.y = data.y;
})
/* ================== 서버 관련 끝 ================== */

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
  gameData.state = event.type;

  if (x != null && y != null) {
    gameData.moveX = x / 50;
    gameData.moveY = y / -50;
  }
}

const handleStop = (event: IJoystickUpdateEvent) => {
  gameData.state = event.type;
}

/* ================== 조이스틱 관련 끝 ================== */

/* ================== 게임 정보 관련 시작 ================== */
//Note: 현재 픽셀 위치 설정은 canvas 360x500을 기준으로 맞춰져있습니다.
const CanvasWidth = 360;
const CanvasHeight = 500;

const ballRad = 20;
const balls = [];
const ballMap = {};
// const myId;

type playerBallType = {
  id: any;
  color: string;
  x: number;
  y: number;
}

class playerBall {
  id: any;
  color: string;
  x: number;
  y: number;

  constructor() {
    this.color = "#FF00FF"
    this.x = 360/2;
    this.y = 500/2;
  }
}

const gameData = {
  x: 100,
  y: 100,
  moveX: 0,
  moveY: 0,
  state: "stop",
}

function joinUser(id: any,color: string,x: number,y: number){
  let ball = new playerBall();
  ball.id = id;
  ball.color = color;
  ball.x = x;
  ball.y = y;

  balls.push(ball);
  // ballMap[id] = ball;

  return ball;
}

/* ================== 게임 정보 관련 끝 ================== */


/* ================== 캔버스 출력 관련 시작 ================== */

function ClearCanvas(ctx: any, canvas: any) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(ctx: any) {
  ctx.beginPath();
  ctx.arc(gameData.x, gameData.y, ballRad, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.stroke();
}

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

      isWallCollision(gameData, canvas, ballRad);

      if (gameData.state === "move"){
        gameData.x += gameData.moveX;
        gameData.y += gameData.moveY;
      } else if (gameData.state === "stop"){
        gameData.moveX = 0;
        gameData.moveY = 0;
      }

      drawCircle(ctx);

      /*==== 캔버스 요소 조작 끝====*/

      //canvas에 애니메이션이 작동하게 하는 함수. 
      requestAnimationFrame(render);
    };
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
