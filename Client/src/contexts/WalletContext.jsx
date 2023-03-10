import { createContext, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Web3 from 'web3'


// START MAGIC Integration
import { Magic } from 'magic-sdk';

const magic = new Magic('pk_live_745DAF0421FA12A3', {
  network: "mumbai", // Ethereum testnet
});

const provider = new ethers.providers.Web3Provider(magic.rpcProvider);

const accounts = await magic.wallet.connectWithUI() // accounts[0] has current public address of the user
const magic_address = accounts[0];
// END MAGIC Integration

export const WalletContext = createContext();

console.log(magic_address);

export const WalletContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(magic_address);
  const [signer, setSigner] = useState(provider.getSigner());

  /*
  const connectWallet = async () => {
    const instance = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(instance, "any");
    const newSigner = await web3Provider.getSigner();
    setSigner(newSigner);
    setWalletAddress(await newSigner.getAddress());

    instance.on("accountsChanged", () => {
      disconnectWallet();
    });

    instance.on("connect", () => {
      connectWallet();
    });

    instance.on("disconnect", () => {
      disconnectWallet();
    });
  };
  */

  const connectWallet = () => {
    setSigner(provider.getSigner());
    setWalletAddress(magic_address);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setSigner(null);
  };

  const providerOptions = {};

  /*
  // Redirect User to Install MetaMask if not already installed
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    providerOptions["custom-metamask"] = {
      display: {},
      package: {},
      connector: async () => {
        window.open("https://metamask.io");
      },
    };
  }
  */

  const web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
  });

  return (
    <WalletContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        walletAddress,
        signer,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
