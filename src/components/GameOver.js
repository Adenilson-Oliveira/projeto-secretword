import'./GameOver.css'

const GameOver = ({retry, score}) => {
  return (
    <div className='end'>
        <h1>Fim de Jogo!</h1>
        <h2>A sua pontuação foi: <span>{score}</span></h2>
        <button className='button' onClick={retry}>Resetar jogo</button>
    </div>
  )
}

export default GameOver