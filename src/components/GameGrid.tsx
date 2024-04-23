import clsx from "clsx"

type GameGridProps = {
    gridLetters: string[][]
    gridColors: string[][]
}
export const GameGrid = ({gridLetters, gridColors}: GameGridProps) => {
    return (
        <div className="flex flex-col gap-1 items-center">
            {gridLetters.map((row, rIndex: number) => (
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
    )
}
