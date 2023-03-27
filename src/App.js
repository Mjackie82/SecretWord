//CSS
import './App.css';

//React
import {useCallback, useEffect, useState} from 'react'

//Data
import { wordsList } from './data/words';

//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id:1, name: 'start'},
  {id:2, name: 'game'},
  {id:3, name: 'end'},
]

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    
    console.log(category)

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    console.log(word)

    
    return{word, category}
  }, [words])

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)
  
  //start game
  const startGame = useCallback(() => {
    //clear all letters
    clearLettersEffect()

    //pick word and category
    const {word, category} = pickWordAndCategory()

    // create a array letter

    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    console.log(word, category)
    console.log(wordLetters)

    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)


    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  //process letter input | for now is just to pass the stages
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    }

    // push guessed letter or remove a guess

    if(letters.includes(normalizedLetter)){
      setGuessedLetters((CurrentGuessedLetters) => [...CurrentGuessedLetters, normalizedLetter])
    }else{
      setWrongLetters((currentWrongLetters) => [...currentWrongLetters, normalizedLetter])

      setGuesses((currentGuesses) => currentGuesses - 1)
    }
    
  }

  const clearLettersEffect = () => {
    setGuessedLetters([])
    setWrongLetters([])
    
  }

  // check if guesses ended
  useEffect(() => {

    if(guesses <= 0){
      // reset all states
      clearLettersEffect()

      setGameStage(stages[2].name)
    }

  }, [guesses])

  //check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    //win condition
    if(guessedLetters.length === uniqueLetters.length){
      // add score
      setScore((currentScore) => currentScore + 100)

      // restarts game with new word
      startGame()
    }


  }, [guessedLetters, letters, startGame])


  //restarts the game

  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  


  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score}/>}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
      
    </div>
  );
}

export default App;
