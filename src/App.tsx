import {useEffect, useState} from "react";
import {MOTS} from "./words.ts";
import "./App.css";
import clsx from "clsx";
import Confetti from 'react-confetti';
import {CornerDownLeft, Delete} from "lucide-react";

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
    const [gameOver, setGameOver] = useState({over: false, message: ""});

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * MOTS.length);
        setRandomWord(MOTS[randomIndex].toUpperCase());
    }, []);


    const checkWin = (colors: string[]) => {
        // Vérifie si toutes les cases de la rangée actuelle sont vertes
        return colors.every(color => color === 'bg-green-500');
    };

    const handleVictory = () => {
        setShowConfetti(true);
        setGameOver({over: true, message: `Félicitations ! Vous avez trouvé le mot : ${randomWord}`});
    };

    const handleGameOver = () => {
        setGameOver({over: true, message: `Perdu, le mot était : ${randomWord}`});
    };

    const updateLetterState = (attempt: string[]) => {
        const newLetterState = {...letterState};
        attempt.forEach((letter, index) => {
            if (!newLetterState[letter]) {
                if (randomWord[index] === letter) {
                    newLetterState[letter] = 'bg-green-500';
                } else if (randomWord.includes(letter)) {
                    newLetterState[letter] = 'bg-yellow-500';
                } else {
                    newLetterState[letter] = 'bg-gray-300';
                }
            }
        });
        setLetterState(newLetterState);
    };

    const updateColorsAndCheckGameStatus = () => {
        const newGridColors = updateColorsForWord(currentAttempt, randomWord);
        setGridColors(gridColors.map((row, idx) => idx === rowIndex ? newGridColors : row));

        if (checkWin(newGridColors)) {
            handleVictory();
        } else if (rowIndex === gridLetters.length - 1) {
            handleGameOver();
        }

        updateLetterState(currentAttempt);

        setCurrentAttempt(Array(5).fill(""));
        setRowIndex(rowIndex < gridLetters.length - 1 ? rowIndex + 1 : rowIndex);
        setColIndex(0);
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const {key} = event;

            if (key === "Enter") {
                handleSubmit();
            } else if (key === "Backspace") {
                handleDelete();
            } else {
                const isLetter = /^[a-zA-Z]$/.test(key);
                if (isLetter && colIndex < 5) {
                    handleKeyPressInput(key.toUpperCase());
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [colIndex, currentAttempt]);

    const handleSubmit = () => {
        if (currentAttempt.every(letter => letter !== "") && colIndex === 5) {
            updateColorsAndCheckGameStatus();
        }
    };


    const handleInput = (letter: string) => {
        if (colIndex < 5) {
            const newAttempt = [...currentAttempt];
            newAttempt[colIndex] = letter;
            setCurrentAttempt(newAttempt);

            // Mise à jour de la grille avec la nouvelle lettre uniquement dans la colonne actuelle
            const newGridLetters = gridLetters.map((row, idx) => {
                if (idx === rowIndex) {
                    const newRow = [...row];
                    newRow[colIndex] = letter;
                    return newRow;
                }
                return row;
            });

            setGridLetters(newGridLetters);

            // Préparer pour la prochaine lettre
            setColIndex(colIndex + 1);
        }
    };

    const handleDelete = () => {
        if (colIndex > 0) {
            const newAttempt = [...currentAttempt];
            newAttempt[colIndex - 1] = "";
            setCurrentAttempt(newAttempt);

            const newGridLetters = [...gridLetters];
            newGridLetters[rowIndex] = newGridLetters[rowIndex].map((cell: string, index: number) => {
                return index === colIndex - 1 ? "" : cell;
            });

            setGridLetters(newGridLetters);
            setColIndex(colIndex - 1);
        }
    };

    const handleKeyPressInput = (letter: string) => {
        handleInput(letter)
    };


    const updateColorsForWord = (attempt: string[], word: string) => {
        const result = Array(5).fill("bg-gray-300"); // Initialiser toutes les lettres comme incorrectes
        const wordLetters = word.split('');
        const attemptLetters = [...attempt];

        // D'abord, marquer toutes les lettres correctement placées
        attemptLetters.forEach((letter, idx) => {
            if (letter === wordLetters[idx]) {
                result[idx] = "bg-green-500";
            }
        });

        // Ensuite, marquer les lettres mal placées
        attemptLetters.forEach((letter, idx) => {
            if (result[idx] !== "bg-green-500" && wordLetters.includes(letter)) {
                result[idx] = "bg-yellow-500";
            }
        });

        return result;
    };

    type VirtualKeyboardProps = {
        onKeyPress: (letter: string) => void;
        onDelete: () => void;
        onEnter: () => void;
        letterState: LetterState;
    }
    const VirtualKeyboard = ({onKeyPress, onDelete, onEnter, letterState}: VirtualKeyboardProps) => {
        // Définition des touches pour chaque rangée
        const keys = [
            ["A", "B", "C", "D", "E", "F", "G"],
            ["H", "I", "J", "K", "L", "M", "N"],
            ["O", "P", "Q", "R", "S", "T", "U"],
            ["V", "W", "X", "Y", "Z"]
        ];

        // Fonction pour rendre une touche du clavier
        const renderKey = (key: string, extraClass = "") => (
            <button key={key} onClick={() => onKeyPress(key)} className={`border rounded-md size-[30px] flex items-center justify-center cursor-pointer mx-1 transition-colors duration-300 ease-in-out ${extraClass} ${letterState[key] || "hover:bg-gray-500/30"}`}>
                {key}
            </button>
        );

        return (
            <div className="flex flex-col items-center justify-center mt-4">
                {keys.map((row, rIndex) => (
                    <div className="flex justify-center gap-1 my-1" key={rIndex}>
                        {rIndex === 3 && (
                            // Touche "Backspace" pour la dernière rangée
                            <button onClick={onDelete} className="border rounded-md size-[30px] flex items-center justify-center cursor-pointer mx-1 transition-colors duration-300 ease-in-out hover:bg-gray-500/30">
                                <Delete size={16}/>
                            </button>
                        )}
                        {row.map((letter) => renderKey(letter))}
                        {rIndex === 3 && (
                            // Touche "Enter" pour la dernière rangée
                            <button onClick={onEnter} className="border rounded-md size-[30px] flex items-center justify-center cursor-pointer mx-1 transition-colors duration-300 ease-in-out hover:bg-gray-500/30">
                                <CornerDownLeft size={16}/>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        );
    };


    return (
        <>
            {showConfetti && <Confetti/>}
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
                                    "border rounded-md size-[50px] flex justify-center items-center transition-colors duration-300 ease-in-out",
                                    gridColors[rIndex][cIndex],
                                )} key={cIndex}>
                                    {cell}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {gameOver.over && (
                    <div className={clsx("my-2", showConfetti ? "text-green-600" : "text-red-400")}>
                        {gameOver.message}
                    </div>
                )}

                <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-500/80">
                    Recommencer le jeu
                </button>

                <VirtualKeyboard onKeyPress={handleInput} onDelete={handleDelete} onEnter={handleSubmit} letterState={letterState}/>

            </div>
        </>
    );
};

export default App;
