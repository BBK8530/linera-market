# Linera Market Data

A comprehensive data dashboard for Linera Market, built with React, TypeScript, and Vite.

## Features

- **Leaderboard**: View top performers with pagination (100 items per page)
- **TOP20**: See the top 20 performers with weekly and all-time views
- **Ranking Selector**: Choose between total ranking and weekly rankings
- **Search Functionality**: Find user details by address
- **Responsive Design**: Optimized for all screen sizes
- **Dark Mode**: Supports both light and dark themes

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Data Management**: @tanstack/react-query
- **API**: GraphQL with native fetch API

## Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm 7.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linera-market-data
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Usage

### Leaderboard

- **Ranking View**: Use the dropdown selector to switch between "Total Ranking" and weekly rankings
- **Search**: Enter an address in the search bar to find user details
- **Pagination**: Navigate through pages or use the "Go to page" input

### TOP20

- **View Toggle**: Switch between "Latest Week TOP 20" and "All Time TOP 20"
- **Weekly Data**: Click on cards to expand and view weekly breakdowns

## Project Structure

```
linera-market-data/
├── src/
│   ├── components/
│   │   ├── Leaderboard.tsx     # Leaderboard component
│   │   └── Top10.tsx           # TOP20 component
│   ├── utils/
│   │   └── graphql.ts          # GraphQL API functions
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # App entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── package.json                 # Project dependencies
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## API Configuration

The GraphQL API endpoint is configured in `src/utils/graphql.ts`. Currently, it points to:

```typescript
const API_URL = 'https://00685068-3c46-44ed-89f1-8cce1224da2a.worker.infra.linera.net/chains/192907fcb85eec2b071f30a097c9152bd6a108486592ab52b53a80e01eaab304/applications/466b0ffc0ba4eeab34a2ff74b4a64e7a88c135ade58bed630ff600f62744d1d6'
```

## Data Structure

### Leaderboard Entry

```typescript
interface LeaderboardEntry {
  key: string;              // User address
  value: {
    lastUpdated: number;    // Timestamp
    slowPeriods: Record<string, {
      count: number;        // Transaction count
      amount: string;       // Total amount
      cost_basis: string;   // Cost basis
    }>;
  };
  totalAmount?: number;      // Calculated total amount
  totalCostBasis?: number;   // Calculated total cost
  profit?: number;           // Calculated profit (amount - cost_basis)
  latestWeekProfit?: number; // Profit for the latest week
  totalRank?: number;        // Rank based on total profit
  latestWeekRank?: number;   // Rank based on latest week profit
}
```

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with React, TypeScript, and Vite
- Styled with Tailwind CSS
- Data fetched using @tanstack/react-query
- GraphQL API integration
