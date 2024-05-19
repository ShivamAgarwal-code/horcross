// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;
import "./IMultiplication.sol";

contract Multiplication {

  function getResult(uint256 num) external view returns (uint256) {
      return num * 2;
  }
  
}