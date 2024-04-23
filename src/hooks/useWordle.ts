import {useEffect, useState} from 'react'
import {MOTS} from "../words.ts"
import {LetterState} from "../type.ts"

export const useWordle = () => {
    const [randomWord, setRandomWord] = useState("")
    const [gridLetters, setGridLetters] = useState(Array(6).fill(Array(5).fill("")))
    const [gridColors, setGridColors] = useState(Array(6).fill(Array(5).fill("")))
    const [currentAttempt, setCurrentAttempt] = useState(Array(5).fill(""))
    const [rowIndex, setRowIndex] = useState(0)
    const [colIndex, setColIndex] = useState(0)
    const [showConfetti, setShowConfetti] = useState(false)
    const [letterState, setLetterState] = useState<LetterState>({})
    const [gameOver, setGameOver] = useState({over: false, message: ""})

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * MOTS.length);
        setRandomWord(MOTS[randomIndex].toUpperCase())
    }, [])

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const {key} = event

            if (key === "Enter") {
                handleSubmit()
            } else if (key === "Backspace") {
                handleDelete()
            } else {
                const isLetter = /^[a-zA-Z]$/.test(key)
                if (isLetter && colIndex < 5) {
                    handleKeyPressInput(key.toUpperCase())
                }
            }
        }

        window.addEventListener('keydown', handleKeyPress)

        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
    }, [colIndex, currentAttempt])

    const checkWin = (colors: string[]) => {
        return colors.every(color => color === 'bg-green-500');
    }

    const handleVictory = () => {
        setShowConfetti(true)
        setGameOver({over: true, message: `Félicitations ! Vous avez trouvé le mot : ${randomWord}`})
    }

    const handleGameOver = () => {
        setGameOver({over: true, message: `Perdu, le mot était : ${randomWord}`})
    }

    const updateLetterState = (attempt: string[]) => {
        const newLetterState = {...letterState}
        attempt.forEach((letter, index) => {
            if (!newLetterState[letter]) {
                if (randomWord[index] === letter) {
                    newLetterState[letter] = 'bg-green-500'
                } else if (randomWord.includes(letter)) {
                    newLetterState[letter] = 'bg-yellow-500'
                } else {
                    newLetterState[letter] = 'bg-gray-300'
                }
            }
        })
        setLetterState(newLetterState)
    }

    const updateColorsAndCheckGameStatus = () => {
        const newGridColors = updateColorsForWord(currentAttempt, randomWord)
        setGridColors(gridColors.map((row, idx) => idx === rowIndex ? newGridColors : row))

        if (checkWin(newGridColors)) {
            handleVictory()
        } else if (rowIndex === gridLetters.length - 1) {
            handleGameOver()
        }

        updateLetterState(currentAttempt)

        setCurrentAttempt(Array(5).fill(""))
        setRowIndex(rowIndex < gridLetters.length - 1 ? rowIndex + 1 : rowIndex)
        setColIndex(0)
    }

    const handleSubmit = () => {
        if (currentAttempt.every(letter => letter !== "") && colIndex === 5) {
            updateColorsAndCheckGameStatus()
        }
    }


    const handleInput = (letter: string) => {
        if (colIndex < 5) {
            const newAttempt = [...currentAttempt]
            newAttempt[colIndex] = letter
            setCurrentAttempt(newAttempt)

            // Mise à jour de la grille avec la nouvelle lettre uniquement dans la colonne actuelle
            const newGridLetters = gridLetters.map((row, idx) => {
                if (idx === rowIndex) {
                    const newRow = [...row]
                    newRow[colIndex] = letter
                    return newRow
                }
                return row
            })

            setGridLetters(newGridLetters)

            // Préparer pour la prochaine lettre
            setColIndex(colIndex + 1)
        }
    }

    const handleDelete = () => {
        if (colIndex > 0) {
            const newAttempt = [...currentAttempt]
            newAttempt[colIndex - 1] = ""
            setCurrentAttempt(newAttempt)

            const newGridLetters = [...gridLetters]
            newGridLetters[rowIndex] = newGridLetters[rowIndex].map((cell: string, index: number) => {
                return index === colIndex - 1 ? "" : cell
            })

            setGridLetters(newGridLetters)
            setColIndex(colIndex - 1)
        }
    }

    const handleKeyPressInput = (letter: string) => {
        handleInput(letter)
    }


    const updateColorsForWord = (attempt: string[], word: string) => {
        const result = Array(5).fill("bg-gray-300") // Initialiser toutes les lettres comme incorrectes
        const wordLetters = word.split('')
        const attemptLetters = [...attempt]

        // D'abord, marquer toutes les lettres correctement placées
        attemptLetters.forEach((letter, idx) => {
            if (letter === wordLetters[idx]) {
                result[idx] = "bg-green-500"
            }
        })

        // Ensuite, marquer les lettres mal placées
        attemptLetters.forEach((letter, idx) => {
            if (result[idx] !== "bg-green-500" && wordLetters.includes(letter)) {
                result[idx] = "bg-yellow-500"
            }
        })

        return result
    }

    return {
        randomWord,
        gridLetters,
        gridColors,
        showConfetti,
        gameOver,
        handleInput,
        handleDelete,
        handleSubmit,
        letterState
    }
}
