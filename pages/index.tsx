import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { collection_list } from "@/constant/collectionlist";
import { SiOpensea } from "react-icons/si";
import { AiOutlineLink } from "react-icons/ai"; // Etherscan icon
import Link from "next/link";
import { sleep } from "@/utils";
import Image from "next/image";

const Home: NextPage = () => {
  const [collectionsData, setCollectionsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCollectionData = async (collectionName: string) => {
      try {
        const response = await fetch(
          `https://api.opensea.io/api/v2/collections/${collectionName}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_KEY || "",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch collection data");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Error fetching collection ${collectionName}:`, error);
        return null;
      }
    };

    const fetchAllCollections = async () => {
      setLoading(true);
      const fetchedData = [];
      for (const collection of collection_list) {
        const data = await fetchCollectionData(collection.toLowerCase());
        if (data) fetchedData.push(data);
        // Add a delay of 1 second between requests
        // await sleep(1000);
      }
      setCollectionsData(fetchedData);
      setLoading(false);
    };

    fetchAllCollections();
  }, []);

  return (
    <div>
      <main className="">
        <section className="p-4">
          <h2 className="text-center text-3xl font-bold mb-4 text-white">
            Trending Collections
          </h2>
          {loading ? (
            <p className="text-white text-center">Loading collections...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 relative">
              {collectionsData.map((collection, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-between bg-gray-800 p-4 rounded-lg group"
                >
                  <Link href={`/collection/${collection.collection}`}>
                    <div className="flex items-center space-x-4 cursor-pointer">
                      <Image
                        className="w-12 h-12 rounded-lg"
                        src={
                          collection.image_url ||
                          "https://via.placeholder.com/200"
                        }
                        alt={collection.name}
                        width={100}
                        height={100}
                      />
                      <div>
                        <p className="text-lg text-white font-bold">
                          {collection.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {collection.collection}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Icons for OpenSea and Etherscan */}
                  <div className="flex space-x-4 z-10">
                    {/* OpenSea Link */}
                    <a
                      href={`https://opensea.io/collection/${collection.collection}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-500 cursor-pointer"
                    >
                      <SiOpensea className="w-6 h-6" color="" />
                    </a>
                    {/* Etherscan Link */}
                    <a
                      href={`https://arbiscan.io/address/${collection.contracts[0]?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-500 cursor-pointer"
                    >
                      <AiOutlineLink className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
