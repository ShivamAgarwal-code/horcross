import fs from 'fs'
import { task } from 'hardhat/config'

task('verify:contract', 'Verify deployed contract')
  .addParam('file')
  .addParam('contract')
  .setAction(async ({ file, contract }, hre) => {
    try {
      const contractAddress = fs.readFileSync(`scripts/address/${hre.network.name}/${contract}.json`)
      const addressData = JSON.parse(contractAddress.toString())
      console.log(addressData.main)
      await hre.run('verify:verify', {
        address: addressData.main,
        constructorArguments: [],
        contract: `contracts/${file}.sol:${contract}`,
      })
    } catch (e) {
      console.log(e)
    }
  },
  )
