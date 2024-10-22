import { Contract, ethers } from "ethers";

// const contractAddress = "0xa66577d82466395567651b9eFF2476831e039682";

// const contractABI = [
//   {
//     inputs: [
//       { internalType: "address", name: "_feeRecipient", type: "address" },
//       { internalType: "address", name: "initialOwner", type: "address" },
//     ],
//     stateMutability: "nonpayable",
//     type: "constructor",
//   },
//   {
//     inputs: [{ internalType: "address", name: "owner", type: "address" }],
//     name: "OwnableInvalidOwner",
//     type: "error",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "OwnableUnauthorizedAccount",
//     type: "error",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "previousOwner",
//         type: "address",
//       },
//       {
//         indexed: true,
//         internalType: "address",
//         name: "newOwner",
//         type: "address",
//       },
//     ],
//     name: "OwnershipTransferred",
//     type: "event",
//   },
//   {
//     inputs: [],
//     name: "FEE_PERCENTAGE",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "nftContract", type: "address" },
//       { internalType: "uint256", name: "tokenId", type: "uint256" },
//       { internalType: "uint256", name: "price", type: "uint256" },
//       { internalType: "address payable", name: "seller", type: "address" },
//     ],
//     name: "buyNFT",
//     outputs: [],
//     stateMutability: "payable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "feeRecipient",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "owner",
//     outputs: [{ internalType: "address", name: "", type: "address" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "renounceOwnership",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { internalType: "address", name: "_feeRecipient", type: "address" },
//     ],
//     name: "setFeeRecipient",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
//     name: "transferOwnership",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
// ];

const contractAddress = "0x3607f79666597820B10270F926B261Fb782ac219";

const contractABI = [
  {
    inputs: [
      { internalType: "address", name: "_feeRecipient", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "feePercent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeRecipient",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftContract", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "seller", type: "address" },
    ],
    name: "purchaseERC1155",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftContract", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "seller", type: "address" },
    ],
    name: "purchaseERC721",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export const CONTRACT_CHAIN_ID = 421614; // Arbitrum Sepolia chain ID

export const getReadOnlyContract = (provider: ethers.Provider): Contract => {
  return new ethers.Contract(contractAddress, contractABI, provider);
};

export const getWriteContract = (signer: ethers.Signer): Contract => {
  return new ethers.Contract(contractAddress, contractABI, signer);
};

// New function to purchase ERC721 NFT
export const purchaseERC721 = async (
  contract: Contract,
  nftContract: string,
  tokenId: number,
  seller: string,
  value: ethers.BigNumberish
): Promise<ethers.ContractTransaction> => {
  return await contract.purchaseERC721(nftContract, tokenId, seller, { value });
};

// New function to purchase ERC1155 NFT
export const purchaseERC1155 = async (
  contract: Contract,
  nftContract: string,
  tokenId: number,
  amount: number,
  seller: string,
  value: ethers.BigNumberish
): Promise<ethers.ContractTransaction> => {
  return await contract.purchaseERC1155(nftContract, tokenId, amount, seller, {
    value,
  });
};
