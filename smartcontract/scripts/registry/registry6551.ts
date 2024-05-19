import { BytesLike, ethers } from 'ethers'
import { config as dotenvConfig } from 'dotenv'
import { ERC6551RegistryABI, ERC6551RegistryAddressSepolia } from '../config'
import { resolve } from 'path'
dotenvConfig({ path: resolve(__dirname, '../../.env') })

async function main () {
  const sepolia = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)
  // console.log(deploy address)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as BytesLike, sepolia) // 獲取連接的錢包
  const erc6551registryContract = new ethers.Contract(ERC6551RegistryAddressSepolia.main, ERC6551RegistryABI.abi, wallet)
  const implementation = ERC6551RegistryAddressSepolia.main
  const ERC721 = '0xEA6734B10Ec3B1420eD920F44663335c533BFc2D'
  const deployAddress = await erc6551registryContract.createAccount(
    implementation,
    11155111,
    ERC721,
    9055,
    153,
    '0x',
  )
  const result = await deployAddress.wait()
  console.log(result)
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
