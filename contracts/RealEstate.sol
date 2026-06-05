//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

//RealEstate contract inherits from ERC721URIStorage, which is an extension of ERC721 that allows us to associate a URI with each token. This URI can point to metadata about the token, such as a description, image, etc. 
//The RealEstate contract uses a counter to keep track of the token IDs and provides a mint function to create new tokens with a specified URI. It also has a totalSupply function to return the total number of tokens minted.
//Each property can be represented as a unique token, and the metadata URI can contain information about the property, such as its location, size, and other relevant details. This allows for easy tracking and transfer of ownership of real estate properties on the blockchain.   
contract RealEstate is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("RealEstate", "RE") {}

    function mint(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // Mint the token to the sender's address(using funcs from ERC721)
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        

        return newItemId;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
