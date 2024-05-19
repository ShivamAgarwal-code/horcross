// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyDOODLE is ERC721{
    uint public MAX_DOODLE = 10000; // 總量

    constructor() ERC721("MyDOODLE", "MDD"){
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/";
    }
    
    function mint(address to, uint tokenId) external {
        require(tokenId >= 0 && tokenId < MAX_DOODLE, "tokenId out of range");
        _mint(to, tokenId);
    }
}