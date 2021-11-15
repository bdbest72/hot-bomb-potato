export default function isWallCollision(gameData: any, canvas: any){
  if (gameData.y - gameData.ballRad <= 0 || 
      gameData.y + gameData.ballRad >= canvas.height) 
      {
      gameData.moveY *= -1;
      }

  if (gameData.x - gameData.ballRad <= 0 || 
      gameData.x + gameData.ballRad >= canvas.width) 
      {
        gameData.moveX *= -1;
      }
}