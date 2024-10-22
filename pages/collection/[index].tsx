import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ethers } from "ethers"; // Import ethers.js for conversion
import Link from "next/link";
import { sleep } from "@/utils";

export default function Collection() {
  const router = useRouter();
  const { index } = router.query; // Accessing the dynamic parameter
  const [collectionData, setCollectionData] = useState<any>(null); // State to hold collection data
  const [nftData, setNftData] = useState<any>([]); // State to hold NFTs data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const itemsPerPage = 20; // Adjust as needed

  // Fetching NFTs Data along with their best listing prices
  const fetchNftData = async () => {
    try {
      const url = `https://api.opensea.io/api/v2/collection/${index}/nfts?limit=${itemsPerPage}${
        nextCursor ? `&next=${nextCursor}` : ""
      }`;
      const nftResponse = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_KEY || "",
        },
      });
      if (!nftResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const nfts = await nftResponse.json();
      const nftList = nfts.nfts;
      setNextCursor(nfts.next);

      // Fetch the best listing price for each NFT with rate limiting
      const nftDataWithPrices = [];
      for (const nft of nftList) {
        const bestListing = await fetchBestListing(nft.identifier);
        nftDataWithPrices.push({
          ...nft,
          bestPrice: bestListing,
        });
      }
      const sortedNftData = [...nftDataWithPrices].sort((a, b) => {
        if (
          a.bestPrice &&
          a.bestPrice !== "N/A" &&
          b.bestPrice &&
          b.bestPrice !== "N/A"
        ) {
          return parseFloat(b.bestPrice) - parseFloat(a.bestPrice);
        } else if (a.bestPrice && a.bestPrice !== "N/A") {
          return -1;
        } else if (b.bestPrice && b.bestPrice !== "N/A") {
          return 1;
        }
        return 0;
      });
      setNftData((prevData: any) => [...prevData, ...sortedNftData]);
      setLoadingMore(false);
    } catch (error) {
      console.error("Failed to fetch NFT data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetching Collection Data
  const fetchCollectionData = async () => {
    try {
      const collectionResponse = await fetch(
        `https://api.opensea.io/api/v2/collections/${index}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_KEY || "",
          },
        }
      );
      if (!collectionResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const collection = await collectionResponse.json();
      setCollectionData(collection);
    } catch (error) {
      console.error("Failed to fetch collection data:", error);
    }
  };

  // Helper function to get the best listing price of an NFT
  const fetchBestListing: any = async (identifier: string) => {
    try {
      const listingResponse = await fetch(
        `https://api.opensea.io/api/v2/listings/collection/${index}/nfts/${identifier}/best`,
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
          return fetchBestListing(identifier); // Retry the request
        }
        throw new Error(`HTTP error! status: ${listingResponse.status}`);
      }
      const listingData = await listingResponse.json();
      // Convert the price from Wei to Ether using ethers.js
      const priceInWei = listingData.price?.current?.value;

      return priceInWei ? ethers.formatUnits(priceInWei.toString(), 18) : ""; // Format to ETH
    } catch (error) {
      console.error("Failed to fetch best listing:", error);
      return "N/A";
    }
  };

  useEffect(() => {
    if (index) {
      fetchCollectionData();
      fetchNftData();
    }
  }, [index]);

  if (loading) {
    return <div className="text-center text-white mt-4">Loading...</div>;
  }

  if (!collectionData) {
    return (
      <div className="text-center text-white mt-4">
        No collection data found.
      </div>
    );
  }

  // Helper function to determine if the URL is an image or a video
  const isImageUrl = (url: string) => {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url.split("?")[0]);
  };

  const loadMore = () => {
    setLoadingMore(true);
    setCurrentPage((prevPage) => prevPage + 1);
    fetchNftData();
  };

  return (
    <main className="relative">
      <div className="bg-gray-800 text-white">
        {/* Header Section */}
        <div className="relative bg-gray-900 p-6 flex flex-col">
          {isImageUrl(collectionData?.banner_image_url) ? (
            <Image
              src={collectionData?.banner_image_url}
              alt={`${collectionData?.name} Banner`}
              layout="responsive"
              width={1000}
              height={200}
            />
          ) : (
            <video
              src={collectionData?.banner_image_url}
              autoPlay
              loop
              muted
              className="w-full h-auto"
            />
          )}
          <div className="mt-4">
            <h1 className="text-4xl font-bold text-center">
              {collectionData.name}
            </h1>
            <p className="mt-2 text-center">{collectionData.description}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-black flex justify-between items-center px-6 py-4 mt-4">
          <div className="text-center">
            <span className="block text-lg font-bold">
              {collectionData?.stats?.floor_price || "N/A"}
            </span>
            <span className="text-sm text-gray-400">FLOOR</span>
          </div>
          <div className="text-center">
            <span className="block text-lg font-bold">
              {collectionData?.owner || "N/A"}
            </span>
            <span className="text-sm text-gray-400">OWNERS</span>
          </div>
          <div className="text-center">
            <span className="block text-lg font-bold">
              {collectionData?.total_supply || "N/A"}
            </span>
            <span className="text-sm text-gray-400">SUPPLY</span>
          </div>
        </div>

        {/* NFTs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {nftData.length > 0 ? (
            nftData.map((nft: any, index: number) => (
              <Link href={`/nft/${nft.contract}/${nft.identifier}`} key={index}>
                <div className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition">
                  <Image
                    src={
                      (nft.display_image_url
                        ? nft.display_image_url
                        : nft.image_url) || "https://via.placeholder.com/200"
                    }
                    alt={nft.name || "NFT Item"}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                    width={200}
                    height={200}
                  />
                  <h2 className="text-lg font-bold">
                    {nft.name
                      ? nft.name.includes("#")
                        ? nft.name
                        : `${nft.name} #${nft.identifier}`
                      : "Unnamed NFT"}
                  </h2>
                  <span className="block text-sm text-gray-400">
                    {nft.token_id}
                  </span>
                  {/* Display the Best Listing Price */}
                  <span className="block text-sm font-bold text-yellow-400">
                    {nft.bestPrice &&
                      nft.bestPrice !== "N/A" &&
                      "Best Price: " +
                        parseFloat(nft.bestPrice).toFixed(2) +
                        " ETH"}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center col-span-full">No NFTs found.</div>
          )}
        </div>

        {/* Pagination */}
        {nftData.length < collectionData.total_supply && (
          <div className="text-center py-4">
            <button
              onClick={loadMore}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
