import React, { useEffect, useRef } from 'react';
import './App.css';
import { Joystick } from 'react-joystick-component';
import isWallCollision from './isWallCollision';
import io from 'socket.io-client'

//Note: 현재 픽셀 위치 설정은 canvas 500x500을 기준으로 맞춰져있습니다.
const socket = io('http://localhost:3000');

const CanvasWidth = 360;
const CanvasHeight = 500;

// 게임 초기 정보 받아와 담기.

function ClearCanvas(ctx: any, canvas: any) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

interface IJoystickUpdateEvent {
  type: "move" | "stop" | "start";
  x: number | null;
  y: number | null;
  direction: JoystickDirection | null;
}

//============배열을 설정해서 여러 ball값을 출력하려고 했던 코드인데 제대로 작동하지 않아서 주석처리함. 불필요하면 삭제해도 됨==========
// var balls = [];
// var ballMap = {};

// function PlayerBall(id){
//   this.id = id;
//   this.color = "#FF00FF";
//   this.x = 1024/2;
//   this.y = 768/2;
// }

// socket.on('join_user', data => {
//   let ball = new PlayerBall(data.id);
//   ball.color = data.color;
//   ball.x = data.x;
//   ball.y = data.y;

//   balls.push(ball);
//   ballMap[data.id] = ball;

//   gameData.x = balls[0].x;
//   gameData.y = balls[0].y;
// });

const gameData = {
  x: 100,
  y: 100,
  color: '',
  moveX: 0,
  moveY: 0,
  state: "stop",
  ballRad: 20,
}

//서버에서 socket.emit('join_user', ...)로 보낸 정보들을 아래 코드에서 받아서 적용해야함
socket.on('join_user', function(data){
  gameData.x = data.x;
  gameData.y = data.y;
  gameData.color = data.color;
})

//여기까지가 초기 상태값 설정
//이제부터 각각의 움직임이 발생하는 모든 부분(데이터가 변경되어야 하는 부분)을 서버로 이동량을 보내줘야 함


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

function drawCircle(ctx: any) {
  ctx.beginPath();
  ctx.arc(gameData.x, gameData.y, gameData.ballRad, 0, 2 * Math.PI);
  ctx.fillStyle = gameData.color;
  ctx.fill();
  ctx.stroke();
}

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

      isWallCollision(gameData, canvas);

      if (gameData.state === "move"){
        gameData.x += gameData.moveX;
        gameData.y += gameData.moveY;
      } else if (gameData.state === "stop"){
        gameData.moveX = 0;
        gameData.moveY = 0;
      }
      
      // ctx.beginPath();
      // ctx.arc(gameData.x, gameData.y, gameData.ballRad, 0, 2 * Math.PI);
      // ctx.fillStyle = "red";
      // ctx.fill();
      // ctx.stroke();

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
