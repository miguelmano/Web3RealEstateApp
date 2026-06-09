const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer, seller, inspector, lender;
    let realEstate, escrow;

    beforeEach(async () => {
        //get accounts from the blockchain
        //assign buyer and seller
        const signers = await ethers.getSigners();
        [buyer, seller, inspector, lender] = signers;
        //console.log(signers);

        //deploy real estate
        const RealEstate = await ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deploy();
        console.log('RealEstate deployed to:', realEstate.address);

        //mint
        //TokenURI: https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS , gets metadata from this link, which is a JSON file that contains the name, description, and image of the property. The image is also stored on IPFS and can be accessed through the link provided in the metadata.
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
        await transaction.wait();

        const Escrow = await ethers.getContractFactory('Escrow');
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            inspector.address,
            lender.address
        );

        //Approve property, so that the escrow contract can transfer the NFT on behalf of the seller
        //Approve function is a default function of the ERC721 standard, which allows the owner of an NFT to approve another address (in this case, the escrow contract) to transfer the NFT on their behalf. 
        // This is necessary for the escrow contract to be able to transfer the NFT from the seller to the buyer when the conditions of the sale are met.
        transaction = await realEstate.connect(seller).approve(escrow.address, 1);
        await transaction.wait();

        //list property
        //List function is a custom function that we created in the Escrow contract, which allows the seller to list their property for sale.
        transaction = await escrow.connect(seller).list(1);
        await transaction.wait();
    })

    describe('Deployment', () => {
        it ('Returns NFT address', async () => {
            const result = await escrow.nftAddress();
            expect(result).to.be.equal(realEstate.address);
        })

        it ('Returns seller address', async () => {
            const result = await escrow.seller();
            expect(result).to.be.equal(seller.address);
        
        })

        it ('Returns inspector address', async () => {
            const result = await escrow.inspector();
            expect(result).to.be.equal(inspector.address);
        })

        it ('Returns lender address', async () => {
            const result = await escrow.lender();
            expect(result).to.be.equal(lender.address);
        })
    })

    describe('Listing', () => {
        it ('Updates ownership of the NFT', async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
        })
    })

})
