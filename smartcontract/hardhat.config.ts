import { HardhatUserConfig } from 'hardhat/config'
import { NetworkUserConfig } from 'hardhat/types'
// hardhat plugin
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'

import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
import { loadTasks } from './helpers/hardhatConfigHelpers'

dotenvConfig({ path: resolve(__dirname, './.env') })

const taskFolder = ['tasks']
loadTasks(taskFolder)

const chainIds = {
  ganache: 1337,
  goerli: 5,
  sepolia: 11155111,
  hardhat: 31337,
  quorum: 81712,
  mainnet: 1,
  avalanche: 43114,
  bsc: 56,
  'arbitrum-mainnet': 42161,
  'arbitrum-goerli': 421613,
  'polygon-mainnet': 137,
  'optimism-goerli': 420,
  'optimism-mainnet': 10,
  'polygon-mumbai': 80001,
  'avalanche-fuji': 43113,
}

// Ensure that we have all the environment variables we need.
const pk: string | undefined = process.env.PRIVATE_KEY
if (!pk) {
  throw new Error('Please set your pk in a .env file')
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY
if (!infuraApiKey) {
  throw new Error('Please set your INFURA_API_KEY in a .env file')
}

function getChainConfig (chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string
  switch (chain) {
    case 'avalanche':
      jsonRpcUrl = 'https://api.avax.network/ext/bc/C/rpc'
      break
    case 'optimism-goerli':
      jsonRpcUrl = 'https://goerli.optimism.io'
      break
    case 'quorum':
      jsonRpcUrl = process.env.QUORUM_URL || ''
      break
    default:
      jsonRpcUrl = `https://${chain}.infura.io/v3/${infuraApiKey}`
  }
  return {
    accounts: [`0x${pk}`],
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  }
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: chainIds.hardhat,
    },
    local: {
      url: 'http://127.0.0.1:8545',
    },
    quorum: getChainConfig('quorum'),
    arbitrum: getChainConfig('arbitrum-mainnet'),
    avalanche: getChainConfig('avalanche'),
    bsc: getChainConfig('bsc'),
    goerli: getChainConfig('goerli'),
    sepolia: getChainConfig('sepolia'),
    mainnet: getChainConfig('mainnet'),
    optimism: getChainConfig('optimism-mainnet'),
    'optimism-goerli': getChainConfig('optimism-goerli'),
    'arbitrum-goerli': getChainConfig('arbitrum-goerli'),
    'polygon-mainnet': getChainConfig('polygon-mainnet'),
    'polygon-mumbai': getChainConfig('polygon-mumbai'),
    'avalanche-fuji': getChainConfig('avalanche-fuji'),
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },
  solidity: {
    version: '0.8.17',
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: 'none',
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY || '',
      avalanche: process.env.SNOWTRACE_API_KEY || '',
      bsc: process.env.BSCSCAN_API_KEY || '',
      goerli: process.env.ETHERSCAN_API_KEY || '',
      sepolia: process.env.ETHERSCAN_API_KEY || '',
      mainnet: process.env.ETHERSCAN_API_KEY || '',
      optimisticEthereum: process.env.OPTIMISM_API_KEY || '',
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      optimisticGoerli: process.env.OPTIMISM_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || '',
      arbitrumGoerli: process.env.SNOWTRACE_API_KEY || '',
      quorum: 'abc',
    },
    customChains: [{
      network: 'quorum',
      chainId: chainIds.quorum,
      urls: {
        apiURL: `${process.env.BLOCKSCOUT_URL}/api`,
        browserURL: process.env.BLOCKSCOUT_URL as string,
      },
    }],
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS as string === 'true',
    excludeContracts: [],
    src: './contracts',
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
}

export default config
