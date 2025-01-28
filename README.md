# 🔮 ProphecyJimpsons

https://jimpsons.org 

ProphecyJimpsons is a revolutionary multi-chain platform for creating, trading, and verifying predictive NFTs. Turn your crystal ball gazing into crypto with zero-cost minting, AI-generated art, and cross-chain compatibility.

## 🚀 Features

- **Free Minting**: Create prediction NFTs with zero initial cost
- **Multi-Chain Support**: Deploy on Solana, Polygon, StarkNet, and Base
- **AI-Generated Art**: Automatic creation of unique NFT artwork
- **JIMP Token Integration**: Native token for platform operations
- **Cross-Chain Compatibility**: Seamless asset transfer between supported chains

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v20 or higher)
- Yarn package manager
- Git

## 💻 Installation

1. Clone the repository:

```bash
git clone https://github.com/Prophecy-Jimpsons/WebApp
cd prophecy-jimpsons
```

1. Install dependencies:

```bash
yarn install
```

1. Create a `.env` file in the root directory and add necessary environment variables (Optimal):

```bash
REACT_APP_ALCHEMY_API_KEY=your_alchemy_api_key
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

## 🚀 Development

To start the development server:

```bash
yarn start
```

Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

## 🏗 Build

To create a production build:

```bash
yarn build
```

To serve the production build locally, you can use a static server:

```bash
yarn global add serve
serve -s build
```

## 📁 Project Structure

```text
prophecy-jimpsons/
├── src/
│   ├── assets/          # Static assets and icons
│   │   └── icons/
│   │       └── chains/  # Blockchain network icons
│   ├── components/      # React components
│   │   ├── ui/         # Reusable UI components
│   │   └── ...         # Feature-specific components
│   └── styles/         # CSS modules and variables
│       └── variables/  # CSS custom properties
├── public/            # Public assets
└── package.json      # Project dependencies and scripts
```

## 🎨 Styling

The project uses CSS Modules for component-specific styling with the following features:

- CSS variables for consistent theming:
  - Colors (--color-primary, --color-secondary, etc.)
  - Spacing (--space-1 through --space-24)
  - Container widths (--container-sm through --container-xl)
- Mobile-first responsive design
- Custom animations and transitions
- Backdrop filters and glass-morphism effects

## 🌐 Supported Blockchain Networks

- **Solana**

  - Fast transaction processing
  - Low gas fees
  - Proof-of-History consensus

- **Polygon**

  - Ethereum compatibility
  - High throughput
  - Low transaction costs

- **StarkNet**

  - Enhanced privacy
  - ZK-rollup security
  - Scalable transactions

- **Base**
  - Ethereum L2 solution
  - Optimistic rollups
  - Native asset bridging

## 🔧 Available Scripts

```bash
# Start development server
yarn start

# Create production build
yarn build

# Preview
yarn preview

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```

## 📦 Key Dependencies

- **React**: UI framework
- **@solana/web3.js**: Solana blockchain interactions
- **@solana/spl-token**: Token program interactions
- **@tanstack/react-query**: Data fetching and caching
- **CSS Modules**: Scoped styling
- **Lucide React**: Icon components
- **Tabler Icons**: Additional icon set

## 🤝 Contributing

1. Fork the repository
1. Create your feature branch (`git checkout -b feature/amazing-feature`)
1. Commit your changes (`git commit -m 'Add amazing feature'`)
1. Push to the branch (`git push origin feature/amazing-feature`)
1. Open a Pull Request

Please ensure your code follows the project's styling and component patterns.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Important Links

- [Documentation](https://jimpsons.gitbook.io/jimpsons.org)
- [White Paper](https://jimpsons.gitbook.io/jimpsons.org)
- [Discord Community](https://discord.gg/prophecyjimpsons)

## 🤔 Support

1. Check our [FAQs](https://jimpsons.gitbook.io/jimpsons.org)
1. Join our [Discord community](https://discord.gg/prophecyjimpsons)
1. Create an issue in the repository

---

Built with 💜 by the ProphecyJimpsons Team
