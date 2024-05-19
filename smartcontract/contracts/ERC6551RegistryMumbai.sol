// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Create2.sol";

import "./interfaces/IERC6551RegistryOtherChain.sol";
import "./lib/ERC6551BytecodeLib.sol";

contract ERC6551RegistryMumbai is IERC6551RegistryOtherChain {
    error InitializationFailed();

    function createAccount(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        bytes calldata initData
    ) external returns (uint256 _chainId, address _tokenContract, uint256 _tokenId,address _account) {

        bytes memory code = ERC6551BytecodeLib.getCreationCode(
            implementation,
            chainId,
            tokenContract,
            tokenId,
            salt
        );

        _chainId = 80001;
        _tokenContract = tokenContract;
        _tokenId = tokenId;
        _account = Create2.computeAddress(bytes32(salt), keccak256(code));

        if (_account.code.length != 0) return (_chainId, _tokenContract, _tokenId, _account);

        emit AccountCreated(_account, implementation, chainId, tokenContract, tokenId, salt);

        _account = Create2.deploy(0, bytes32(salt), code);

        if (initData.length != 0) {
            (bool success, ) = _account.call(initData);
            if (!success) revert InitializationFailed();
        }
        return (_chainId, _tokenContract, _tokenId, _account);
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
}