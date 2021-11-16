export default function isBallCollision(gameData: any, canvas: any){
  const rSum = 40;
  const dx = gameData.x - 250;
  const dy = gameData.y - 250;
  // console.log(gameData.x, gameData.y)

  if (rSum*rSum > dx*dx + dy*dy) {
    console.log("hello")
    gameData.moveY *= -2;
    gameData.moveX *= -2;
  }
}