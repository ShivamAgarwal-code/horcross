// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";

import "./interfaces/IERC6551Registry.sol";
import "./lib/ERC6551BytecodeLib.sol";


interface ICreateAccountFromAnotherChain is IERC6551Registry{
    function createAccount(address implementation, uint256 chainId, address tokenContract, uint256 tokenId, uint256 salt, bytes calldata initData) external returns (address);
}

contract ERC6551RegistryAndReadCall is IERC6551Registry {
    error InitializationFailed();

    // mapping (address => uint256) public acountCount;

    address public owner;
    IGateway public gatewayContract;
    address public requestAddress;

    event ReceivedData(uint256 _chainId, address _tokenContract, uint256 _tokenId, address _account);

    constructor (address payable gatewayAddress, string memory feePayerAddress){
        owner = msg.sender;
        gatewayContract = IGateway(gatewayAddress); 
        gatewayContract.setDappMetadata(feePayerAddress);
    }

    function setDappMetadata(string memory feePayerAddress) public {
    require(msg.sender == owner, "only owner");
    gatewayContract.setDappMetadata(feePayerAddress);
  }

    function setGateway(address gateway) external {
    require(msg.sender == owner, "only owner");
    gatewayContract = IGateway(gateway);
  }

    function createAccount(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        bytes calldata initData
    ) external returns (address) {

        bytes memory code = ERC6551BytecodeLib.getCreationCode(
            implementation,
            chainId,
            tokenContract,
            tokenId,
            salt
        );

        address _account = Create2.computeAddress(bytes32(salt), keccak256(code));

        if (_account.code.length != 0) return _account;

        emit AccountCreated(_account, implementation, chainId, tokenContract, tokenId, salt);

        _account = Create2.deploy(0, bytes32(salt), code);

        if (initData.length != 0) {
            (bool success, ) = _account.call(initData);
            if (!success) revert InitializationFailed();
        }
        // acountCount[msg.sender]++;
        return _account;
    }

    function account(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt
    ) external view returns (address) {
        bytes32 bytecodeHash = keccak256(
            ERC6551BytecodeLib.getCreationCode(
                implementation,
                chainId,
                tokenContract,
                tokenId,
                salt
            )
        );

        return Create2.computeAddress(bytes32(salt), bytecodeHash);
    }

    // function account() public view returns (uint256) {
    //     returns acountCount[];
    // }
    function abiPacketAccount(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        bytes calldata initData
    ) public pure returns (bytes memory packet) {
        packet = abi.encodeCall(ICreateAccountFromAnotherChain.createAccount, 
        (implementation, chainId, tokenContract, tokenId, salt, initData));
    }

    function getRequestMetadata(
        uint64 destGasLimit,
        uint64 destGasPrice,
        uint64 ackGasLimit,
        uint64 ackGasPrice,
        uint128 relayerFees,
        uint8 ackType,
        bool isReadCall,
        bytes memory asmAddress
    ) public pure returns (bytes memory) {
        bytes memory requestMetadata = abi.encodePacked(
            destGasLimit,
            destGasPrice,
            ackGasLimit,
            ackGasPrice,
            relayerFees,
            ackType,
            isReadCall,
            asmAddress
        );
        return requestMetadata;
    }

    function sendReadRequest(
        string calldata destChainId,
        string calldata destinationContractAddress,
        bytes calldata requestMetadata,
        bytes memory packet
    ) public payable {
        bytes memory requestPacket = abi.encode(destinationContractAddress, packet);
        
        gatewayContract.iSend{ value: msg.value }(
            1,
            0,
            string(""),
            destChainId,
            requestMetadata,
            requestPacket
        );
    }

    function iAck(
        uint256 ,// requestIdentifier
        bool ,// execFlag
        bytes memory execData
    ) external {
        (uint256 _chainId, address _tokenContract, uint256 _tokenId, address _account) = abi.decode(execData, (uint256, address, uint256, address));

        emit ReceivedData(_chainId, _tokenContract, _tokenId, _account);
    }
} 
