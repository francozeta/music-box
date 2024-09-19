import React from "react"
import Sidebar from "./sidebar"
import TopBar from "./topbar"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full h-screen">
    <Sidebar />
    <div className="flex-1 bg-gray-100">
      <TopBar />
      <div className="">
        {children}
      </div>
    </div>
  </div>
}

export default Layout