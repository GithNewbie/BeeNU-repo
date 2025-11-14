import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BeeNU - Blockchain Provenance Tracking',
  description: 'Track your honey from hive to jar with blockchain verification',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm border-b border-honey-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-2xl">🍯</span>
                  <span className="text-xl font-bold text-honey-700">BeeNU</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-honey-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link 
                  href="/factory" 
                  className="text-gray-700 hover:text-honey-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  🏭 Factory
                </Link>
                <Link 
                  href="/seller" 
                  className="text-gray-700 hover:text-honey-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  🏪 Seller
                </Link>
                <Link 
                  href="/consumer" 
                  className="text-gray-700 hover:text-honey-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  👤 Consumer
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-50 border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © 2025 BeeNU MVP - Blockchain-backed provenance tracking
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
