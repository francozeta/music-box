import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Star } from "lucide-react"

interface MusicCardProps {
  imageUrl: string
  songTitle: string
  artistName: string
  description: string
  rating: number
}

export default function Component({ 
  imageUrl = "/placeholder.svg?height=100&width=100", 
  songTitle = "Canción Ejemplo", 
  artistName = "Artista Ejemplo", 
  description = "Esta es una descripción de ejemplo para la canción. Aquí puedes incluir detalles sobre el género, el álbum, o cualquier otra información relevante.", 
  rating = 4 
}: MusicCardProps) {
  return (
    <Card className="bg-[#2c2c54] text-[#f5f6fa] p-4 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex items-start space-x-4">
        <img 
          src={imageUrl} 
          alt="Album cover" 
          className="w-24 h-24 rounded-md object-cover"
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold">{songTitle}</h2>
          <p className="text-sm opacity-75">{artistName}</p>
          <p className="text-sm mt-2">{description}</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < rating ? 'text-[#fbc531]' : 'text-[#dcdde1]'}`} 
            fill={i < rating ? '#fbc531' : 'none'}
          />
        ))}
      </div>
      
      <div className="mt-4 flex justify-between">
        <Button 
          variant="outline" 
          className="flex-1 mr-2 bg-transparent border-[#f5f6fa] text-[#f5f6fa] hover:bg-[#f5f6fa] hover:text-[#2c2c54]"
        >
          <Heart className="w-4 h-4 mr-2" />
          Me gusta
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 ml-2 bg-transparent border-[#f5f6fa] text-[#f5f6fa] hover:bg-[#f5f6fa] hover:text-[#2c2c54]"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Comentarios
        </Button>
      </div>
    </Card>
  )
}