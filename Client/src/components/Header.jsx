import React, { useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";
import { shortAddress } from "../utils/utils";
import xmtpLogo from "../assets/xmtp-logo.png";
import { XmtpContext } from "../contexts/XmtpContext";
import { MdOutlineContentCopy } from 'react-icons/md';

const Header = () => {
  const { connectWallet, walletAddress, signer } = useContext(WalletContext);
  const [providerState] = useContext(XmtpContext);

  console.log(walletAddress)

  return (
    <div className="header flex align-center justify-between">
      <img className="logo" alt="XMTP Logo" src={xmtpLogo} />
      {walletAddress ? (
        <div className="flex align-center header-mobile">
          <h3>{shortAddress(walletAddress)}</h3>
          <button className="btn" onClick={() => {
            navigator.clipboard.writeText(walletAddress)}}>
             <MdOutlineContentCopy />
          </button>
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
