import { Outlet } from 'react-router-dom'
import Navbar from './navbar'
import Footer from './footer'

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout 