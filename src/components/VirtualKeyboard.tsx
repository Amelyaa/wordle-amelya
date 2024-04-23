import {CornerDownLeft, Delete} from "lucide-react"
import {LetterState} from "../type.ts"

type VirtualKeyboardProps = {
    onKeyPress: (letter: string) => void
    onDelete: () => void
    onEnter: () => void
    letterState: LetterState
}

export const VirtualKeyboard = ({onKeyPress, onDelete, onEnter, letterState}: VirtualKeyboardProps) => {
    const keys = [
        ["A", "B", "C", "D", "E", "F", "G"],
        ["H", "I", "J", "K", "L", "M", "N"],
        ["O", "P", "Q", "R", "S", "T", "U"],
        ["V", "W", "X", "Y", "Z"]
    ]

    const renderKey = (key: string, extraClass = "") => (
        <button key={key} onClick={() => onKeyPress(key)} className={`border rounded-md size-[30px] flex items-center justify-center cursor-pointer mx-1 transition-colors duration-300 ease-in-out ${extraClass} ${letterState[key] || "hover:bg-gray-500/30"}`}>
            {key}
        </button>
    )

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
    )
}
