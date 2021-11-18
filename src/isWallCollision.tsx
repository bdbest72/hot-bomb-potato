export default function isWallCollision(joystickData: any, curPlayer: any, canvasHeight: any, canvasWidth: number, tempX: number, tempY: number, ballRad: number){
  if (curPlayer.y - ballRad <= 0) { //천장
    if (joystickData.moveY < 0 ) {
      joystickData.moveY = 0;
      tempY = 0;
      console.log("hit bottom")
    }
    
  } else if (curPlayer.y + ballRad >= canvasHeight) { //바닥
    if (joystickData.moveY > 0 ) {
      joystickData.moveY = 0;
      tempY = 0;
      console.log("hit top")
    }
  }

  if (curPlayer.x - ballRad <= 0) { //왼쪽 벽
    if (joystickData.moveX < 0 ) {
      joystickData.moveX = 0;
      tempX = 0;
      console.log("hit left")
    }
  } else if (curPlayer.x + ballRad >= canvasWidth) { //오른쪽 벽
    if (joystickData.moveX > 0 ) {
      joystickData.moveX = 0;
      tempX = 0;
      console.log("hit right")
    }
  }
  // console.log(joystickData.moveX, joystickData.moveY)
  return [tempX, tempY];
}