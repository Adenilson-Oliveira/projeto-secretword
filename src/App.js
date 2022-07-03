// css
import './App.css';
// hooks
import {useCallback, useEffect, useState} from 'react'
// data
import {wordsList} from './data/words'
// components
import StarScreen from './components/StarScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';



function App() {

  const stages = [
    {id: 1, name: 'start'},
    {id: 2, name: 'game'},
    {id: 3, name: 'end'}
  ]

  

  const [gameStage, setGameStage] = useState(stages[0].name)  
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState('')
  

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)


  const pickWordAndCategory = useCallback(() => {

    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // console.log(category)


    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    // console.log(word)

    return {word, category}

  }, [words])
  

 // start
 const startGame = useCallback(() => {
  //clear all letter
  clearLetterStates()

  // pick word and pick category
  const { word, category } = pickWordAndCategory()

  //create an array of letters
  let wordLetters = word.split('')

  wordLetters = wordLetters.map((l) => l.toLowerCase())

  // console.log(category, word)
  // console.log(wordLetters)


  //fill states
  setPickedWord(word)
  setPickedCategory(category)
  setLetters(wordLetters)

  setGameStage('game')// era pra ser o 'stage[1].name'

 }, [pickWordAndCategory])

  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if(
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }

    // push guessed letter or remove a guess
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ])

    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, 
        normalizedLetter,
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }

    // ---
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check if guesses ended
  useEffect(() => {
    if(guesses <= 0 ) {
      //reset all states
      clearLetterStates()

      setGameStage('end') // era pra ser o 'stages[2].name'
    }
  }, [guesses])

  // check win condition
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    // win condition 
    if(guessedLetters.length === uniqueLetters.length && uniqueLetters.length !== 0) {
      // add score
      setScore((actualScore) => actualScore += 100)

      startGame()

      // console.log('guessedLetters: ' + guessedLetters, 'uniqueLetters: ' + uniqueLetters)
    }

    // console.log(uniqueLetters)

  }, [guessedLetters, letters, startGame])

  // restarts the game
  const retry = () => {
    setScore(0)
    setGuesses(3)

    setGameStage(stages[0].name)
  }

  



  return (
    <div className="App">
      {gameStage === 'start' && <StarScreen startGame = {startGame}/>}
      {gameStage === 'game' && 
      <Game 
        verifyLetter = {verifyLetter}
        pickedWord = {pickedWord}
        pickedCategory = {pickedCategory}
        letters = {letters}
        guessedLetters = {guessedLetters}
        wrongLetters = {wrongLetters}
        guesses = {guesses}
        score = {score}
      />}
      {gameStage === 'end' && <GameOver retry = {retry} score={score}/>}
    </div>
  );
}

export default App;
