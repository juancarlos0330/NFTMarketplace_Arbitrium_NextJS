import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { getReadOnlyContract, getWriteContract } from "@/contract/contract";

export default function NFTDetail() {
  const router = useRouter();
  const query = router.query;
  const [nftData, setNftData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { collection, id } = query;
    if (collection && id) {
      // Helper function to get the best listing price of an NFT
      const fetchBestListing: any = async (
        slug: string,
        identifier: string
      ) => {
        try {
          const listingResponse = await fetch(
            `https://api.opensea.io/api/v2/listings/collection/${slug}/nfts/${id}/best`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_KEY || "",
              },
            }
          );
          if (!listingResponse.ok) {
            if (listingResponse.status === 429) {
              console.log("Rate limit hit, waiting before retrying...");
              return fetchBestListing(slug, identifier); // Retry the request
            }
            throw new Error(`HTTP error! status: ${listingResponse.status}`);
          }
          const listingData = await listingResponse.json();
          // Convert the price from Wei to Ether using ethers.js
          const priceInWei = listingData.price?.current?.value;

          return priceInWei
            ? ethers.formatUnits(priceInWei.toString(), 18)
            : ""; // Format to ETH
        } catch (error) {
          console.error("Failed to fetch best listing:", error);
          return "N/A";
        }
      };

      const fetchNFTData = async () => {
        try {
          const response = await fetch(
            `https://api.opensea.io/api/v2/chain/arbitrum/contract/${collection}/nfts/${id}`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_KEY || "",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const bestListing = await fetchBestListing(
            data.nft.collection,
            data.nft.identifier
          );
          setNftData({ ...data.nft, bestPrice: bestListing });
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch NFT data:", error);
          setLoading(false);
        }
      };

      fetchNFTData();
    }
  }, [query]);

  const buyNFT = async () => {
    if (!nftData || !nftData.bestPrice) return;

    try {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const priceInWei = ethers.parseEther(nftData.bestPrice);
        const contract = getWriteContract(signer);

        console.log("NFT Data:", nftData);
        console.log("Purchase Parameters:", {
          contractAddress: nftData.contract,
          identifier: nftData.identifier,
          price: priceInWei.toString(),
          seller: nftData.owners[0].address,
        });

        let transaction;
        if (nftData.token_standard === "ERC1155") {
          transaction = await contract.purchaseERC1155(
            nftData.contract,
            nftData.identifier,
            1,
            nftData.owners[0].address,
            { value: priceInWei, gasLimit: 1000000 }
          );
        } else {
          transaction = await contract.purchaseERC721(
            nftData.contract,
            nftData.identifier,
            nftData.owners[0].address,
            { value: priceInWei, gasLimit: 1000000 }
          );
        }

        console.log("Transaction submitted:", transaction.hash);
        const receipt = await transaction.wait();
        console.log("Transaction receipt:", receipt);

        if (receipt.status === 0) {
          throw new Error("Transaction failed");
        }

        console.log("NFT purchased successfully!");
      } else {
        console.log("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error buying NFT:", error);
      if (error instanceof Error) {
        console.log(`Failed to buy NFT: ${error.message}`);
        if ("reason" in error) {
          console.log(`Error reason: ${(error as any).reason}`);
        }
        if ("code" in error) {
          console.log(`Error code: ${(error as any).code}`);
        }
        if ("transaction" in error) {
          console.log(`Transaction details:`, (error as any).transaction);
        }
        if ("receipt" in error) {
          console.log(`Transaction receipt:`, (error as any).receipt);
        }
      } else {
        console.log("An unknown error occurred while trying to buy the NFT");
      }
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (!nftData) {
    return <div className="text-center text-white">NFT not found.</div>;
  }

  return (
    <main className="bg-gray-800 text-white relative min-h-[calc(100vh-76px)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          {nftData.name || `NFT #${nftData.identifier}`}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image
              src={nftData.image_url || "https://via.placeholder.com/500"}
              alt={nftData.name || "NFT Image"}
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <p className="mb-2">
              <strong>Token ID:</strong> {nftData.identifier}
            </p>
            <p className="mb-2 capitalize">
              <strong>Collection:</strong> {nftData.collection}
            </p>
            <p className="mb-4">
              <strong>Description:</strong>{" "}
              {nftData.description || "No description available."}
            </p>
            {/* Add more details as needed */}
            {nftData.bestPrice && nftData.bestPrice !== "N/A" ? (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={buyNFT}
              >
                Buy Now
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
