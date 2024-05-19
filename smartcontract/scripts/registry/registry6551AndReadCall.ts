import { BytesLike, ethers } from 'ethers'
import { config as dotenvConfig } from 'dotenv'
import { ERC6551RegistryAndReadCallABI, ERC6551RegistryAndReadCallAddress, ERC6551AccountUpgradeableAddress, ERC6551RegistryFujiAddress } from '../config'
import { resolve } from 'path'
dotenvConfig({ path: resolve(__dirname, '../../.env') })

async function main () {
  const goerli = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL)
  // console.log(deploy address)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as BytesLike, goerli)
  const erc6551registryandreadcallContract = new ethers.Contract(ERC6551RegistryAndReadCallAddress.main, ERC6551RegistryAndReadCallABI.abi, wallet)
  const implementation = ERC6551AccountUpgradeableAddress.main
  const ERC721 = '0x7BFc0b2a0bF455f0D40831274Dec5487A814d243' // MyDOODLE address

  const accountABI = await erc6551registryandreadcallContract.abiPacketAccount(implementation, 5, ERC721, 240, 100, '0x8129fc1c')
  const accountABIresult = accountABI
  console.log('accountAbiResult:', accountABIresult)

  const getMetadata = await erc6551registryandreadcallContract.getRequestMetadata(0, 0, 0, 0, 0, 1, true, '0x')
  const getMetadataResult = getMetadata
  console.log('getMetadata:', getMetadataResult)

  const sendRequest = await erc6551registryandreadcallContract.sendReadRequest('43113', ERC6551RegistryFujiAddress.main, getMetadataResult, accountABIresult)
  const sendRequestResult = sendRequest
  console.log('sendRequest:', sendRequestResult)

  // const addTbaAddress = await erc6551registryandreadcallContract.addTbaAddress(ERC721, 316, 5, '0xab962FbF0C92D00016501d60dfa98d2fd05575bb')
  // const addTbaAddressResult = await addTbaAddress.wait()
  // console.log(addTbaAddressResult)

  // const showTbas = await erc6551registryandreadcallContract.getTbas(ERC721, 316)
  // const showTbasResult = showTbas
  // console.log('Tbas: ', showTbasResult)
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
