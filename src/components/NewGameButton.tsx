export const NewGameButton = () => {
    return (
        <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-500/80">
            Recommencer le jeu </button>
    )
}
