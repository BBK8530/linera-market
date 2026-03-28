import { useQuery } from '@tanstack/react-query'
import { fetchRankings } from '../utils/graphql'

interface RankingItem {
  id: string
  name: string
  symbol: string
  rank: number
  marketCap: number
  volume24h: number
}

const Rankings = () => {
  const {
    data: rankings,
    isLoading,
    isError,
    error
  } = useQuery<RankingItem[]>({
    queryKey: ['rankings'],
    queryFn: fetchRankings,
    refetchInterval: 10 * 60 * 1000, // 10分钟自动刷新
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Failed to load rankings</p>
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Market Rankings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rankings?.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {item.rank}
                </div>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${item.marketCap.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">24h Volume</span>
                <span className="text-sm font-medium">${item.volume24h.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Rankings
