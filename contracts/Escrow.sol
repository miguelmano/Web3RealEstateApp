//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    address public nftAddress;
    address payable public seller;
    address public inspector;
    address public lender;

    constructor(
        address _nftAddress, 
        address payable _seller, 
        address _inspector, 
        address _lender
    ) {
        nftAddress = _nftAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    function list(uint256 _nftId) public{
        //Transfer the NFT from the seller to the escrow contract
        //msg.sender is the one calling the list function, which should be the seller. 
        //The NFT will be transferred from the seller's address to the escrow contract's address. This ensures that the NFT is held securely in escrow until the conditions of the sale are met.
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftId);
    }
}
