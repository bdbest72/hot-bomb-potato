export default function isWallCollision(gameData: any, canvas: any, ballRad: number){
  if (gameData.y - ballRad <= 0 || 
      gameData.y + ballRad >= canvas.height) 
      {
        gameData.moveY *= -1;
      }

  if (gameData.x - ballRad <= 0 || 
      gameData.x + ballRad >= canvas.width) 
      {
        gameData.moveX *= -1;
      }
}