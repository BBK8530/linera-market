import { useState, useEffect } from 'react'
import Leaderboard from './components/Leaderboard'
import Top20 from './components/Top10'

function App() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'top20'>('leaderboard')

  // 模拟加载过程
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Loading Linera Market Data...</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Please wait while we fetch the latest data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="data:image/svg+xml,%3csvg%20width='37'%20height='37'%20viewBox='0%200%2037%2037'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M18.1269%200C8.11564%200%200%208.23761%200%2018.3993C0%2028.5609%208.11564%2036.7987%2018.1269%2036.7987C28.138%2036.7987%2036.2538%2028.5609%2036.2538%2018.3993C36.2538%208.23761%2028.138%200%2018.1269%200ZM13.0265%209.43053H23.2298L24.6325%2011.8985H11.6212L13.0239%209.43053H13.0265ZM23.3233%2018.3993L20.7301%2022.9581H15.5261L12.933%2018.3993L15.5312%2013.8328H20.7276L23.3258%2018.3993H23.3233ZM7.69608%2026.2623L3.22249%2018.3993L7.69861%2010.5311L8.9042%2012.6501L5.63368%2018.3993L8.90167%2024.1434L7.69608%2026.2623ZM7.92355%2018.3993L10.5218%2013.8328H13.3298L10.7315%2018.3993L13.3247%2022.9581H10.5167L7.92355%2018.3993ZM23.2272%2027.368H13.0265L11.6187%2024.8923H14.4267L14.4317%2024.9002H21.827L21.8321%2024.8923H24.64L23.2323%2027.368H23.2272ZM22.9265%2022.9581L25.5198%2018.3993L22.9214%2013.8328H25.7293L28.3277%2018.3993L25.7345%2022.9581H22.9265ZM28.555%2026.2623L27.3495%2024.1434L30.6176%2018.3993L27.3469%2012.6501L28.5525%2010.5311L33.0286%2018.3993L28.555%2026.2623Z'%20fill='%23DE2A02'/%3e%3c/svg%3e" alt="Linera Logo" className="mr-3 flex-shrink-0" style={{ height: '40px', width: 'auto' }} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Linera Market Data</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md ${
                  activeTab === 'leaderboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('top20')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md ${
                  activeTab === 'top20'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                TOP20
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        {activeTab === 'leaderboard' ? <Leaderboard /> : <Top20 />}
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-md mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Linera Market Data © 2026
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
