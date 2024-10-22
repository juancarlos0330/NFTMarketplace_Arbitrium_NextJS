"use client";
import {
  useChainModal,
  useConnectModal,
  useAccountModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useConnect } from "wagmi";
import useMount from "./useMount";
export enum WALLET_STATUS {
  initialising = "initializing",
  connected = "connected",
  disconnected = "disconnected",
}
import { useEthersProvider, useEthersSigner } from "./useEthers";
const OPEN_NFT_CHAIN = 1101;
const OPEN_NFT_TEST_CHAIN = 421614;

const useWallet = () => {
  const mounted = useMount();

  const {
    address: walletAddress,
    isConnected: isWalletConnected,
    chain: walletChain,
  } = useAccount();
  // const { chain: walletChain } = useNetwork();
  const { data: walletBalance } = useBalance();
  const { openConnectModal: connectWallet } = useConnectModal();
  const { openChainModal: switchChainInWallet } = useChainModal();
  const { openAccountModal } = useAccountModal();
  const { disconnect: disconnectwallet } = useDisconnect();

  const { connectors } = useConnect();
  const account = {
    address: walletAddress,
    balance: walletBalance,
    chain: walletChain,
  };
  const signer = useEthersSigner({
    chainId: walletChain?.id,
  });
  const etherProvider = useEthersProvider({
    chainId: walletChain?.id,
  });

  return {
    account,
    walletStatus: !mounted
      ? WALLET_STATUS.initialising
      : isWalletConnected
      ? WALLET_STATUS.connected
      : WALLET_STATUS.disconnected,
    providerType: connectors.length > 0 ? connectors[0]?.name : "MetaMask",
    etherProvider,
    provider: signer,
    chainId: account?.chain?.id,
    isWalletConnected,
    connectWallet: connectWallet ? connectWallet : () => {},
    disconnectwallet,
    switchChainInWallet,
    openAccountModal,
    isCorrectChain: walletChain?.id === OPEN_NFT_TEST_CHAIN,
  };
};

export default useWallet;
