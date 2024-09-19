import React from "react"
import MusicCard from "../components/musicCard"

const InicioPage = () => {
    return (
        <div className="bg-black w-full p-4">
            <h1>Inicio </h1>
            <MusicCard imageUrl="/placeholder.svg?height=100&width=100" songTitle="Canción Ejemplo" artistName="Artista Ejemplo" description="Esta es una descripción de ejemplo para la canción. Aquí puedes incluir detalles sobre el género, el álbum, o cualquier otra información relevante." rating={4} />
        </div>
    )
}

export default InicioPage