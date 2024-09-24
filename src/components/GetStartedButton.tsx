import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
const GetStartedButton = () => {
  return (
    <Button variant="default" className='text-neutral-black bg-white rounded-full hover:bg-gray-200'>
      Get started <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )
}

export default GetStartedButton