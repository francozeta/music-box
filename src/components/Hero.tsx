import { Button } from './ui/button'
import ImgEarphone from '../assets/main-image.png'
import GetStartedButton from './GetStartedButton'
import { ArrowRight } from 'lucide-react'

const Hero = () => {
  return (
    <div className="mt-4 bg-transparent flex items-center justify-center p-8"> {/* removed: min-h-screen */}
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Melody for Music Lovers
          </h1>
          <p className="text-zinc-400 text-xl">
            Discover, rate and discuss music
          </p>
          <div className="flex gap-4">
            <GetStartedButton />
            <Button variant="outline">Explore <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src={ImgEarphone}
            alt="Stylized white over-ear headphones"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero