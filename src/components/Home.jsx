import WalletBalance from "./WalletBalance";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import MyNFt from "../artifacts/contracts/MyNFT.sol/MyNFT.json"
import './row.css';
import './button1.css';

const contractAddress="0x309824e8912099ff5250e36F0E0b7538B205BA1E";
const provider = new ethers.providers.Web3Provider(window.ethereum);

const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, MyNFt.abi, signer);


function Home(){

    const[totalMinted, setTotalMinted] = useState(0);
     useEffect(()=>{
         getCount();
     },[]);
    const getCount = async()=>{
        const count = await contract.count();
        setTotalMinted(parseInt(count));
    }
    return (
      <div>
        <WalletBalance />

        <h1>Colour NFT Collection</h1>
        <div className="container">
          <div className="row">
            {Array(totalMinted)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="col-sm">
                  <NFTImage tokenId={i} getCount={getCount} />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }



function NFTImage({ tokenId, getCount }) {
    const contentId = 'QmRDsbBbhiPMeWioN6h8Xii8jc2aNjTXwZkaGqaudHTt7r';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

  
    const [isMinted, setIsMinted] = useState(false);
    useEffect(() => {
      getMintedStatus();
    }, [isMinted]);
  
    const getMintedStatus = async () => {
      const result = await contract.isContentOwned(metadataURI);
      console.log(result)
      setIsMinted(result);
    };
  
    const mintToken = async () => {
      const connection = contract.connect(signer);
      const addr = connection.address;
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.utils.parseEther('0.01'),
      });
  
      await result.wait();
      getMintedStatus();
      getCount();
    };
  
    async function getURI() {
      const uri = await contract.tokenURI(tokenId);
      alert(uri);
    }
    return (
        <div className="card" style={{ width: '18rem' }}>
          <img className="card-img-top" src={isMinted ? imageURI : 'img/placeholder.png'}></img>
          <div className="card-body">
            <h5 className="card-title">ID #{tokenId}</h5>
            {!isMinted ? (
              <button className="button1" onClick={mintToken}>
                Mint
              </button>
            ) : (
              <button className="button1" onClick={getURI}>
                Taken! Show URI
              </button>
            )}
          </div>
        </div>
      );
    }
    

export default Home;