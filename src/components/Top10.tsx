import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { fetchLeaderboard } from '../utils/graphql'

interface SlowPeriod {
  count: number
  amount: string
  cost_basis: string
}

interface LeaderboardEntry {
  key: string
  value: {
    lastUpdated: number
    slowPeriods: Record<string, SlowPeriod>
  }
  totalAmount?: number
  totalCostBasis?: number
  profit?: number
}

const Top20Card = ({ entry, index, expandedCard, setExpandedCard }: {
  entry: LeaderboardEntry
  index: number
  expandedCard: string | null
  setExpandedCard: (key: string | null) => void
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
          index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' :
          'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
        }`}>
          {index + 1}
        </div>
        <div>
          <h4 className="font-semibold text-lg">Rank {index + 1}</h4>
          <p className="text-sm font-mono truncate text-gray-600 dark:text-gray-400 max-w-[120px]">{entry.key.substring(0, 6)}...{entry.key.substring(entry.key.length - 4)}</p>
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
        <span className="text-lg font-bold">{entry.totalAmount?.toFixed(4)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">Total Cost Basis</span>
        <span className="text-lg font-medium">{entry.totalCostBasis?.toFixed(4)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">Profit</span>
        <span className={`text-lg font-bold ${(entry.profit || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {(entry.profit || 0) >= 0 ? '+' : ''}{(entry.profit || 0).toFixed(4)}
        </span>
      </div>
    </div>

    {/* Weekly Data Details */}
    <div className="mt-4 pt-4 border-t dark:border-gray-700">
      <button
        onClick={() => setExpandedCard(expandedCard === entry.key ? null : entry.key)}
        className="w-full text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center justify-center gap-1"
      >
        {expandedCard === entry.key ? 'Collapse' : 'View Weekly Data'}
        <svg className={`w-4 h-4 transform transition-transform ${expandedCard === entry.key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expandedCard === entry.key && (
        <div className="mt-4 space-y-3 animate-fadeIn">
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Weekly Data Details</h5>
          {Object.entries(entry.value.slowPeriods).map(([week, period]) => (
            <div key={week} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Week {parseInt(week) + 1}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Count: {period.count}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                  <span className="ml-1 font-medium">{parseFloat(period.amount).toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Cost:</span>
                  <span className="ml-1 font-medium">{parseFloat(period.cost_basis).toFixed(4)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="mt-4 pt-4 border-t dark:border-gray-700">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
        <span className="text-sm font-medium">{new Date(entry.value.lastUpdated / 1000).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
)

const Top20 = () => {
  const [activeView, setActiveView] = useState<'latest' | 'allTime'>('latest')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const {
    data: leaderboard,
    isLoading,
    isError,
    error
  } = useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    refetchInterval: 10 * 60 * 1000,
  })

  // Find the latest week
  const latestWeek = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0) return null
    let maxWeek = 0
    leaderboard.forEach(entry => {
      Object.keys(entry.value.slowPeriods).forEach(week => {
        const weekNum = parseInt(week)
        if (weekNum > maxWeek) maxWeek = weekNum
      })
    })
    return maxWeek
  }, [leaderboard])

  // Total TOP20 (based on profit across all weeks)
  const totalTop20 = useMemo(() => {
    return leaderboard?.map(entry => {
      let totalAmount = 0
      let totalCostBasis = 0

      Object.values(entry.value.slowPeriods).forEach(period => {
        totalAmount += parseFloat(period.amount)
        totalCostBasis += parseFloat(period.cost_basis)
      })

      return {
        ...entry,
        totalAmount,
        totalCostBasis,
        profit: totalAmount - totalCostBasis
      }
    }).sort((a, b) => b.profit - a.profit).slice(0, 20)
  }, [leaderboard])

  // Latest Week TOP20 (based on the latest week's profit)
  const latestWeekTop20 = useMemo(() => {
    if (latestWeek === null) return []

    return leaderboard?.map(entry => {
      const latestPeriod = entry.value.slowPeriods[latestWeek.toString()]
      const totalAmount = latestPeriod ? parseFloat(latestPeriod.amount) : 0
      const totalCostBasis = latestPeriod ? parseFloat(latestPeriod.cost_basis) : 0

      return {
        ...entry,
        totalAmount,
        totalCostBasis,
        profit: totalAmount - totalCostBasis
      }
    }).filter(entry => entry.totalAmount > 0)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 20)
  }, [leaderboard, latestWeek])

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading TOP20 Data...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please wait while we fetch the latest data</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Failed to load TOP20 data</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  const currentData = activeView === 'latest' ? latestWeekTop20 : totalTop20
  const title = activeView === 'latest' ? 'Latest Week TOP 20' : 'All Time TOP 20'
  const subtitle = activeView === 'latest'
    ? `Week ${latestWeek !== null ? latestWeek + 1 : '-'} performers by profit`
    : 'Top performers by profit across all weeks'

  return (
    <div className="space-y-8">
      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setActiveView('latest')
            setExpandedCard(null)
          }}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeView === 'latest'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
          }`}
        >
          Latest Week TOP 20
        </button>
        <button
          onClick={() => {
            setActiveView('allTime')
            setExpandedCard(null)
          }}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeView === 'allTime'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
          }`}
        >
          All Time TOP 20
        </button>
      </div>

      {/* Title Section */}
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
          activeView === 'latest' ? 'from-green-600 to-teal-600' : 'from-blue-600 to-purple-600'
        }`}>
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{subtitle}</p>
      </div>

      {/* TOP 20 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentData?.map((entry: LeaderboardEntry, index: number) => (
          <Top20Card
            key={`${activeView}-${entry.key}`}
            entry={entry}
            index={index}
            expandedCard={expandedCard}
            setExpandedCard={setExpandedCard}
          />
        ))}
      </div>
    </div>
  )
}

export default Top20
