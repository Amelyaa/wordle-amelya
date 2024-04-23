import {useEffect, useState} from "react";
import {MOTS} from "./words.ts";
import "./App.css";
import clsx from "clsx";
import Confetti from 'react-confetti';

const App = () => {
    const [randomWord, setRandomWord] = useState("");
    const [gridLetters, setGridLetters] = useState(Array(6).fill(Array(5).fill("")));
    const [gridColors, setGridColors] = useState(Array(6).fill(Array(5).fill("")));
    const [currentAttempt, setCurrentAttempt] = useState(Array(5).fill(""));
    const [rowIndex, setRowIndex] = useState(0);
    const [colIndex, setColIndex] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

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
                newGridColors[rowIndex][colIndex] = isLetterMisplaced ? "bg-yellow-500" : "bg-red-300"; // Lettre correcte mais mal placée ou incorrecte
            } else {
                newGridColors[rowIndex][colIndex] = "bg-red-300"; // Lettre incorrecte
            }

            setGridLetters(newGridLetters);
            setGridColors(newGridColors);
            setCurrentAttempt(newAttempt);

            // Passer à la prochaine cellule ou à la ligne suivante si c'est la dernière cellule
            if (colIndex === 4) {
                setCurrentAttempt(Array(5).fill(""));
                setRowIndex(rowIndex < 5 ? rowIndex + 1 : rowIndex);
                setColIndex(0);

                if(checkWin(newGridColors[rowIndex])) {
                    // L'utilisateur a gagné
                    setShowConfetti(true);
                    alert('Félicitations ! Vous avez gagné !'); // Pour l'instant, nous utilisons une alerte simple
                }
            } else {
                setColIndex(colIndex + 1);
            }
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
                                    // Ici, nous utilisons l'index de la rangée et de la colonne pour récupérer la couleur correspondante
                                    gridColors[rIndex][cIndex],
                                )} key={cIndex}>
                                    {cell}
                                </div>
                            ))}
                        </div>
                    ))}

                </div>
                <div className="flex flex-col items-center justify-center mt-4">
                    {[...Array(4)].map((_, rIndex) => (
                        <div className="flex justify-center gap-1 my-1" key={rIndex}>
                            {Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i))
                                .slice(rIndex * 7, rIndex * 7 + 7 + (rIndex === 3 ? 6 : 0))
                                .map((letter) => (
                                    <button key={letter} onClick={() => handleLetterClick(letter)} className="border border-gray-500 rounded-md size-[30px] flex items-center justify-center cursor-pointer mx-1 hover:bg-gray-500/30">
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
