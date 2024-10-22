import Link from "next/link";
import React, { useState, useEffect } from "react";
import useWallet from "@/hooks/useWallet";
import { collection_list } from "@/constant/collectionlist";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function Header() {
  const { isWalletConnected, connectWallet, provider, account, etherProvider } =
    useWallet();
  const [searchInput, setSearchInput] = useState(""); // State to track the search input
  const [filteredCollections, setFilteredCollections] = useState<any>([]); // State to track filtered collections
  const [isSticky, setIsSticky] = useState(false); // State to track sticky header

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);

    // Filter the collection_list based on input
    const filtered = collection_list.filter((collection) =>
      collection.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredCollections(filtered);
  };

  // Sticky header logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`${
        isSticky
          ? "fixed top-0 w-full z-50 bg-gray-900 text-white shadow-lg py-2"
          : "relative w-full z-50 bg-gray-900 text-white py-4"
      } transition-all duration-500 ease-in-out`}
    >
      <div className="flex items-center justify-between px-4 max-w-screen-xl mx-auto">
        {/* Logo and Navigation */}
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer hover:opacity-80">
              Fable
            </h1>
          </Link>
          <button className="ml-4 bg-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-600 transition">
            +
          </button>
        </div>

        {/* Search Input */}
        <div className="flex-1 mx-4 relative">
          <input
            type="text"
            placeholder="Search collections name or contract address"
            className="w-full p-2 text-black rounded-lg"
            value={searchInput}
            onChange={handleInputChange}
          />

          {/* Dropdown list */}
          {searchInput && filteredCollections.length > 0 && (
            <div
              className="absolute left-0 right-0 top-full bg-white text-black rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto flex flex-col z-50"
              onClick={() => setSearchInput("")}
            >
              {filteredCollections.map((collection: any, index: number) => (
                <Link
                  key={index}
                  href={`/collection/${collection}`}
                  passHref
                  className="px-2 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {collection}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Connect Wallet Button */}
        <div className="flex space-x-4">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="bg-yellow-gradient py-[10px] px-[20px] rounded-[60px] cursor-pointer hover:bg-yellow-600 transition"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="bg-red-500 py-[10px] px-[20px] rounded-[60px] cursor-pointer"
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className="bg-yellow-gradient py-[10px] px-[20px] rounded-[60px] cursor-pointer flex items-center">
                        <button
                          onClick={openChainModal}
                          type="button"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {chain.hasIcon && (
                            <div>
                              {chain.iconUrl && (
                                <Image
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  width={24}
                                  height={24}
                                />
                              )}
                            </div>
                          )}
                        </button>

                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="ml-4"
                        >
                          {account.displayName}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}
