import { BytesLike, ethers } from 'ethers'
import { config as dotenvConfig } from 'dotenv'
import { MyDOODLEABI, MyDOODLEAddress } from '../config'
import { resolve } from 'path'
dotenvConfig({ path: resolve(__dirname, '../../.env') })

async function main () {
  const goerli = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as BytesLike, goerli)
  const myDoodle = new ethers.Contract(MyDOODLEAddress.main, MyDOODLEABI.abi, wallet)

  const mint = await myDoodle.mint('0x08b831b770EeFa0602763D9C365350c8D324A29A', 7560)
  const result = await mint.wait()
  console.log(result)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
