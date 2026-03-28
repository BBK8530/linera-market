import { useQuery } from '@tanstack/react-query'
import { fetchMarketData } from '../utils/graphql'

interface MarketItem {
  id: string
  name: string
  symbol: string
  price: number
  volume24h: number
  change24h: number
}

const MarketData = () => {
  const {
    data: marketData,
    isLoading,
    isError,
    error
  } = useQuery<MarketItem[]>({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 5 * 60 * 1000, // 5分钟自动刷新
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
        <p className="text-red-500 mb-4">Failed to load market data</p>
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
      <h2 className="text-2xl font-semibold">Market Overview</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Symbol</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">24h Volume</th>
              <th className="px-4 py-3 text-right">24h Change</th>
            </tr>
          </thead>
          <tbody>
            {marketData?.map((item, index) => (
              <tr key={item.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3 font-mono">{item.symbol}</td>
                <td className="px-4 py-3 text-right font-mono">${item.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono">${item.volume24h.toLocaleString()}</td>
                <td className={`px-4 py-3 text-right font-mono ${item.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MarketData
