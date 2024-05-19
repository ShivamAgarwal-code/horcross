// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";

interface IMultiplication {
  function getResult(uint256 num) external view returns (uint256);
}

contract ReadCall {
    IGateway public gatewayContract;
    address public owner;
    uint256 public value;

    event ReceivedData( uint256 value);

    constructor(
        address payable gatewayAddress,
        string memory feePayerAddress
    ) {
        owner = msg.sender;
        gatewayContract = IGateway(gatewayAddress);

        gatewayContract.setDappMetadata(feePayerAddress);
    }

    /// @notice function to set the fee payer address on Router Chain.
    /// @param feePayerAddress address of the fee payer on Router Chain.
    function setDappMetadata(string memory feePayerAddress) external {
        require(msg.sender == owner, "only owner");
        gatewayContract.setDappMetadata(feePayerAddress);
    }

    /// @notice function to set the Router Gateway Contract.
    /// @param gateway address of the Gateway contract.
    function setGateway(address gateway) external {
        require(msg.sender == owner, "only owner");
        gatewayContract = IGateway(gateway);
    }

    /// @notice function to get the request metadata to be used while initiating cross-chain request
    /// @return requestMetadata abi-encoded metadata according to source and destination chains
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
        uint256 _value
    ) public payable {
        bytes memory packet = abi.encodeCall(IMultiplication.getResult, (_value));
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
      uint256 ,//requestIdentifier,
      bool ,//execFlag,
      bytes memory execData
    ) external {
      value = abi.decode(execData, (uint256));

      emit ReceivedData( value);
    }
}
