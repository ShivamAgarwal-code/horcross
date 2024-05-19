// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

interface IMultiplication {
  function getResult(uint256 num) external view returns (uint256);
}