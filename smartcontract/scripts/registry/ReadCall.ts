import { BytesLike, ethers } from 'ethers'
import { config as dotenvConfig } from 'dotenv'
import { ReadCallABI, ReadCallAddress } from '../config'
import { resolve } from 'path'
dotenvConfig({ path: resolve(__dirname, '../../.env') })

async function main () {
  const goerli = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL)
  // console.log(deploy address)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as BytesLike, goerli) // 獲取連接的錢包
  const readCall = new ethers.Contract(ReadCallAddress.main, ReadCallABI.abi, wallet)

  const getMetadata = await readCall.getRequestMetadata(0, 0, 0, 0, 0, 1, true, '0x')
  const getMetadataResult = getMetadata
  console.log('getMetadata:', getMetadataResult)

  const sendRequest = await readCall.sendReadRequest('43113', '0xd6553acCB04454F9A201852f872DC4e8f25067c8', getMetadataResult, 20)
  const sendRequestResult = sendRequest
  console.log('sendRequest:', sendRequestResult)

  // const getAck = await readCall.iAck(12591, true, 0x0000000000000000000000000000000000000000000000000000000000000028, {
  //   gasLimit: 200000,
  // })
  // const getAckResult = getAck
  // console.log('getAck:', getAckResult)
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
