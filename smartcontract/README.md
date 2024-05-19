<div align="center">
  <h1> Horcoss </h1>
</div>

> Brand-New Standard ERC-6551C - Cross-Chain Non-fungible Token Bound Accounts

[ERC-6551]((https://eips.ethereum.org/EIPS/eip-6551)) is a persona to entry meta-verse. Contains transaction history and assets and control by the source NFT. Within it ever make NFT tell story and store value.

Horcross is a solution that addresses the limitation of [ERC-6551](https://eips.ethereum.org/EIPS/eip-6551), which only allow generating EVM-compatible addresses on the chain to which the NFT belongs. 

Through the **CrossTalk** feature of Router Protocol, Horcross enables the cross-chain functionality of generating addresses on any blockchain. 

Horcorss can enhance the cross-chain capability of your NFTs and empower you to control assets across multiple universes. This enables more GameFi projects to utilize NFTs on the main chain as the primary validated assets for Token Bound, while also allowing for the composability of digital assets and their association with user accounts.

---
## Demo Link

- **Horcross** (**ERC-6551C**: send request contract): [`0x584D36C268C7958B37ec9712E9E99149CD2Ca129`](https://goerli.etherscan.io/address/0x584D36C268C7958B37ec9712E9E99149CD2Ca129)

- **Mumbai** Account: (Create Account Contract on polygon-mumbai): [`0xb81E4C5C87AdBC33e0f02688F02C48342d3b857F`](https://mumbai.polygonscan.com/address/0xb81E4C5C87AdBC33e0f02688F02C48342d3b857F)

- **Fuji** Account: (Create Account Contract on avalanche-fuji): [`0xb47F1613F779fB01A8eb6934EA99B5A495ea17A5`](https://testnet.snowtrace.io/address/0xb47F1613F779fB01A8eb6934EA99B5A495ea17A5)

- Horcoss Github: [github.com/Horcross](https://github.com/Horcross)

- Frontend: [horcross.github.io/frontend](https://horcross.github.io/frontend/)

- Demo Video: [YouTube](https://www.youtube.com/watch?v=A9mItzQmLVk)

## Our Tech Stack:

1. **CrossTalk** [`ERC6551RegistryAndReadCall.sol`](https://github.com/Horcross/smartcontract/blob/main/contracts/ERC6551RegistryAndReadCall.sol) : [RouterProtocal](https://www.routerprotocol.com/) Cross Chain Gateway Library, Use it to send the request to the destChain.
2. **Solidity** [`contracts`]([./contracts/](https://github.com/Horcross/smartcontract)): ERC-6551C, follow standard from ERC-6551 and add gateway to send crosstalk message
3. **NextJS** [`frontend`](https://github.com/Horcross/frontend): With WAGMI and connectKIT, provide multi chains connection ability
4. **GraphQL** & Alchemy NFT SDK [Subgraph](https://github.com/Horcross/subgraph): Accelerate the retrieval of cross-chain data

## Project
Our project aims to address the limitation of EIP-6551, which only allow generating contract wallet addresses on the chain to which the NFT belongs. To expand its functionality, we have adopted Router Protocol's cross-chain communication method called CrossTalk. Through this solution, we enable the generation of addresses on any blockchain using EIP-6551 implemented on any blockchain.

Our solution has the following features and advantages:

1. **Cross-chain communication**: Leveraging Router Protocol's CrossTalk feature, we achieve communication between different blockchains. This enables our ERC-721 tokens to generate addresses on other blockchains, expanding their use cases.

1. **Extending EIP-6551 functionality**: Through our solution, EIP-6551 is no longer limited to generating addresses compatible only with the EVM. Now, it can generate addresses on multiple blockchains, providing greater flexibility and choice.

1. **Enhancing token interoperability**: Through cross-chain communication and address generation capabilities, our project facilitates token interoperability between different blockchains. This provides users and developers with more opportunities, making token circulation and exchange easier across different blockchain environments.

Our project is dedicated to advancing the blockchain ecosystem by breaking the limitations of ERC-6551 in address generation and offering more choices and flexibility. We believe that this will bring more opportunities and innovations to users and developers, driving the application and adoption of blockchain technology.

## How we do it?
User can choose the chain on which they want to deploy Token Bonding Accounts (TBA). Once the selection is made, it will be executed by the smart contract, and the TBA address can be obtained by returning it through CrossTalk.

Step 1. User choose the chain deploy Token Bound Account from source chain (**Goerli**)

Step 2. Router CrossTalk (**iSend**) send a create account Transaction to dstChain (**mumbai / Fuji**)

Step 3. dstChain generate a address and emit a event

Step 4. CrossTalk (**iAck**) listen on the address and get from source chain (**Goerli**)
![2023-07-04 105631.png](https://cdn.dorahacks.io/static/files/1891ed6d47779d40b87b26d47748ad1c.png)