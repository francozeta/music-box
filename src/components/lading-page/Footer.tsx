import { Github, Twitter } from "lucide-react"
import { Link } from 'react-router-dom'
import ModeToggle from '../mode-toggle'

const footerSections = [
  {
    title: "Explore",
    links: ["Home", "Popular Reviews", "Trending Albums", "Top Reviewers", "Genres", "New Releases"],
  },
  {
    title: "About Us",
    links: ["Our Story", "Mission & Vision", "The Team"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact Us", "FAQ", "Report a Problem"],
  },
  {
    title: "Legal",
    links: ["Terms of Service", "Privacy Policy", "Copyright Policy", "Cookie Policy"],
  },
]

export default function Footer() {

  return (
    <footer className="bg-transparent text-white py-12 px-[60px] border-t border-gray-400">
      <div className="justify-center max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="font-bold mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link}>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-col md:flex-row justify-between items-center  max-w-[1200px] mx-auto">
        <p className="text-gray-400 mb-4 md:mb-0">
          © 2024 Musicbox, Inc.
        </p>
        <div className="flex items-center space-x-4">
          <Link to="#" className="text-gray-400 hover:text-white transition-colors">
            <Github size={24} />
          </Link>
          <Link to="#" className="text-gray-400 hover:text-white transition-colors">
            <Twitter size={24} />
          </Link>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <label htmlFor="modal-toggle" className="sr-only">
              Toggle theme
            </label>
          </div>
        </div>
      </div>
    </footer>
  )
}