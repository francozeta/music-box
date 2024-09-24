import { Link } from 'react-router-dom'
import GetStartedButton from '../GetStartedButton'

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md bg-opacity-50 z-50 py-3 px-[60px] border-b border-gray-400">
        <div className="w-[100%] max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Musicbox</div>
          <nav className="flex items-center space-x-5">
            <Link to="/signin" className="text-white">
              Sign in
            </Link>
            <GetStartedButton />
          </nav>
        </div>
      </header>
    </>

  )
}
/* text-white border-white hover:bg-white hover:text-gray-900" */