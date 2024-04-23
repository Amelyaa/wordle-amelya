import "./App.css"
import Confetti from 'react-confetti'
import {VirtualKeyboard} from "./components/VirtualKeyboard.tsx"
import {GameGrid} from "./components/GameGrid.tsx"
import {NewGameButton} from "./components/NewGameButton.tsx"
import {GameOverMessage} from "./components/GameOverMessage.tsx"
import {useWordle} from "./hooks/useWordle.ts"

const App = () => {
    const {
        showConfetti,
        gridLetters,
        gridColors,
        gameOver,
        handleInput,
        handleDelete,
        handleSubmit,
        letterState
    } = useWordle()

    return (
        <>
            {showConfetti && <Confetti/>}
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Wordle - Amelya</h1>
                <GameGrid gridLetters={gridLetters} gridColors={gridColors}/>

                <GameOverMessage gameOver={gameOver} showConfetti={showConfetti}/>

                <NewGameButton/>

                <VirtualKeyboard onKeyPress={handleInput} onDelete={handleDelete} onEnter={handleSubmit} letterState={letterState}/>

            </div>
        </>
    )
}

export default App
