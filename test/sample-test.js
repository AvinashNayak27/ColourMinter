const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const MyNFT = await ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy();
    await myNFT.deployed();

    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const metadataURI = 'cid/test.png';

    let balance = await myNFT.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await myNFT.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.001') });

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await myNFT.balanceOf(recipient)
    expect(balance).to.equal(1);

    expect(await myNFT.isContentOwned(metadataURI)).to.equal(true);
    const newlyMintedToken2 = await myNFT.payToMint(recipient, 'foo', { value: ethers.utils.parseEther('0.001') });
  });
});