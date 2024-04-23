import clsx from "clsx"

type GameOverMessageProps = {
    gameOver: {
        over: boolean
        message: string
    }
    showConfetti: boolean
}
export const GameOverMessage = ({gameOver, showConfetti}: GameOverMessageProps) => {
    return (
        <>
            {gameOver.over && (
                <div className={clsx("my-2", showConfetti ? "text-green-600" : "text-red-400")}>
                    {gameOver.message}
                </div>
            )}
        </>
    )
}
