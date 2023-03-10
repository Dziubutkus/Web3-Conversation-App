import React, { useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";
import { shortAddress } from "../utils/utils";
import xmtpLogo from "../assets/xmtp-logo.png";
import conversationLogo from "../assets/conversation-logo.png";
import { XmtpContext } from "../contexts/XmtpContext";
import { MdOutlineContentCopy } from 'react-icons/md';

const Header = () => {
  const { connectWallet, disconnectWallet, walletAddress, signer } = useContext(WalletContext);
  const [providerState] = useContext(XmtpContext);

  return (
    <div className="header flex align-center justify-between">
      <img className="logo" alt="Conversation Logo" src={conversationLogo} />
      {walletAddress ? (
        <div className="flex align-center header-mobile">
          <h3>{shortAddress(walletAddress)}</h3>
          <button className="btn" onClick={() => {
            navigator.clipboard.writeText(walletAddress)}}>
             <MdOutlineContentCopy />
          </button>
          {providerState.client && ( 
            <button 
              className="btn" 
              onClick={() => disconnectWallet()} 
            > 
              Disconnect
            </button>
          )}
          {!providerState.client && (
            <button
              className="btn"
              onClick={() => providerState.initClient(signer)}
            >
              Launch App
            </button>
          )}
        </div>
      ) : (
        <button className="btn" onClick={connectWallet}>
          {!window.ethereum || !window.ethereum.isMetaMask
            ? "Install MetaMask"
            : "Connect wallet"}
        </button>
      )}
    </div>
  );
};

export default Header;
