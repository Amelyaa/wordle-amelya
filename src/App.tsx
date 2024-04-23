import {useEffect, useState} from "react";
import {MOTS} from "./words.ts";
import "./App.css";
import clsx from "clsx";
import Confetti from 'react-confetti';

type LetterState = {
    [key: string]: string;
}

const App = () => {
    const [randomWord, setRandomWord] = useState("");
    const [gridLetters, setGridLetters] = useState(Array(6).fill(Array(5).fill("")));
    const [gridColors, setGridColors] = useState(Array(6).fill(Array(5).fill("")));
    const [currentAttempt, setCurrentAttempt] = useState(Array(5).fill(""));
    const [rowIndex, setRowIndex] = useState(0);
    const [colIndex, setColIndex] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [letterState, setLetterState] = useState<LetterState>({});
    const [gameOver, setGameOver] = useState({ over: false, message: "" });

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * MOTS.length);
        setRandomWord(MOTS[randomIndex].toUpperCase());
    }, []);


    const checkWin = (colors: string[]) => {
        // Vérifie si toutes les cases de la rangée actuelle sont vertes
        return colors.every(color => color === 'bg-green-500');
    };

    const handleLetterClick = (letter: string) => {
        if (colIndex < 5) {
            const newAttempt = [...currentAttempt];
            newAttempt[colIndex] = letter;

            // Mise à jour de la grille avec la nouvelle lettre
            const newGridLetters = [...gridLetters];
            newGridLetters[rowIndex] = newGridLetters[rowIndex].map((cell: string, index: number) => index === colIndex ? letter : cell);

            // Mise à jour des couleurs pour la lettre entrée
            const newGridColors = [...gridColors];
            newGridColors[rowIndex] = newGridColors[rowIndex].slice();

            // Déterminez si la lettre est correcte
            if (letter === randomWord[colIndex]) {
                newGridColors[rowIndex][colIndex] = "bg-green-500"; // Lettre correcte et bien placée
            } else if (randomWord.includes(letter)) {
                // Si la lettre est présente ailleurs dans le mot
                const isLetterMisplaced = randomWord.split('').some((wordLetter, wordIndex) => {
                    return wordLetter === letter && newAttempt[wordIndex] !== letter && newGridColors[wordIndex] !== "bg-green-500/60";
                });
                newGridColors[rowIndex][colIndex] = isLetterMisplaced ? "bg-yellow-500" : "bg-gray-300"; // Lettre correcte mais mal placée ou incorrecte
            } else {
                newGridColors[rowIndex][colIndex] = "bg-gray-300"; // Lettre incorrecte
            }

            setGridLetters(newGridLetters);
            setGridColors(newGridColors);
            setCurrentAttempt(newAttempt);

            if (colIndex === 4) {
                // Si la dernière ligne est remplie et que le mot n'est pas trouvé
                if (rowIndex === gridLetters.length - 1 && !newGridColors[rowIndex].every((color: string) => color === "bg-green-500")) {
                    setGameOver({ over: true, message: `Perdu, le mot était : ${randomWord}` });
                }

                setCurrentAttempt(Array(5).fill(""));
                setRowIndex(rowIndex < 5 ? rowIndex + 1 : rowIndex);
                setColIndex(0);

                if(checkWin(newGridColors[rowIndex])) {
                    setShowConfetti(true);
                    alert('Félicitations ! Vous avez gagné !');
                }
            } else {
                setColIndex(colIndex + 1);
            }

            const newLetterState = { ...letterState };
            if (randomWord.includes(letter)) {
                if (randomWord[colIndex] === letter) {
                    newLetterState[letter] = 'bg-green-500'; // Correct et bien placé
                } else if (!newLetterState[letter] || newLetterState[letter] !== 'bg-green-500') {
                    newLetterState[letter] = 'bg-yellow-500'; // Correct mais mal placé
                }
            } else {
                newLetterState[letter] = 'bg-gray-300'; // Incorrect
            }

            setLetterState(newLetterState);

        }
    };

    return (
        <>
            {showConfetti && <Confetti />}
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Wordle</h1>
                <div className="mt-4">
                    <h2>Le mot aléatoire est : {randomWord}</h2>
                </div>
                <div className="flex flex-col gap-1 items-center">
                    {gridLetters.map((row, rIndex) => (
                        <div className="flex gap-1" key={rIndex}>
                            {row.map((cell: string, cIndex: number) => (
                                <div className={clsx(
                                    "border rounded-md size-[50px] flex justify-center items-center",
                                    gridColors[rIndex][cIndex],
                                )} key={cIndex}>
                                    {cell}
                                </div>
                            ))}
                        </div>
                    ))}

                </div>

                {gameOver.over && (
                    <div className="my-2 text-red-400">
                        {gameOver.message}
                    </div>
                )}

                <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-500/80">
                    Recommencer le jeu
                </button>

                <div className="flex flex-col items-center justify-center mt-4">
                    {[...Array(4)].map((_, rIndex) => (
                        <div className="flex justify-center gap-1 my-1" key={rIndex}>
                            {Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i))
                                .slice(rIndex * 7, rIndex * 7 + 7 + (rIndex === 3 ? 6 : 0))
                                .map((letter) => (
                                    <button key={letter} onClick={() => handleLetterClick(letter)} className={clsx(
                                        "border rounded-md size-[30px] flex items-center justify-center cursor-pointer mx-1 button-transition",
                                        letterState[letter] || "hover:bg-gray-500/30"
                                    )}>
                                        {letter}
                                    </button>
                                ))}
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
};

export default App;
