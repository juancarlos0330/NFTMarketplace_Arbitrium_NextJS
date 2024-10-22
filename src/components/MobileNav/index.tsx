import { useClickAway } from "react-use";
import { useRef } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Squash as Hamburger } from "hamburger-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { exchange_base_data, header_data } from "./data";
import { exo_Font } from "@/font/font";
export const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, () => setOpen(false));

  return (
    <div ref={ref} className="xl:hidden text-white">
      <Hamburger toggled={isOpen} size={20} toggle={setOpen} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 shadow-4xl right-0 top-[5.5rem] p-5 pt-0 bg-neutral-950 border-b border-b-white/20"
          >
            <ul className="grid gap-2">
              {header_data.map((row, idx) => {
                return (
                  <motion.li
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1 + idx / 10,
                    }}
                    key={idx}
                    className="w-full p-[0.08rem] rounded-xl bg-gradient-to-tr from-neutral-800 via-neutral-950 to-neutral-700"
                  >
                    {/* {header_data.map((row, index) => ( */}
                    <div
                      className="relative group flex items-center justify-start px-3 py-4"
                      key={idx}
                    >
                      {row.sub.length ? (
                        <span
                          className={`flex flex-row text-white cursor-pointer items-center w-full mt-2 text-base text-left bg-transparent rounded-lg md:w-auto md:inline md:mt-0 focus:outline-none ${exo_Font.className}`}
                        >
                          {row.label}
                        </span>
                      ) : (
                        <a href={row.link}>
                          <span
                            className={`text-white cursor-pointer ${exo_Font.className}`}
                          >
                            {row.label}
                          </span>
                        </a>
                      )}

                      {row.sub.length ? (
                        <div className="absolute z-10 hidden bg-black group-hover:block top-12 left-3 w-[300px]">
                          <div className="px-2 pt-2 pb-4 bg-black shadow-lg">
                            <div className="flex flex-col">
                              {row.sub?.map((list, key) => (
                                <a
                                  href={list.link}
                                  key={key}
                                  target={
                                    list.title === "Swap" ||
                                    list.title === "Stake"
                                      ? "_self"
                                      : "_blank"
                                  }
                                >
                                  <span
                                    className={`text-beige cursor-pointer text-xs hover:text-white ${exo_Font.className}`}
                                  >
                                    {list.title}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    {/* ))} */}
                  </motion.li>
                );
              })}
              <motion.li
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1 + 4 / 10,
                }}
                className="w-full p-[0.08rem] rounded-xl bg-gradient-to-tr from-neutral-800 via-neutral-950 to-neutral-700"
              >
                <div className="relative group px-3 py-4 flex items-center">
                  <span
                    className={`flex flex-row text-white cursor-pointer items-center w-full mt-2 text-base text-left bg-transparent rounded-lg md:w-auto md:inline md:mt-0 focus:outline-none ${exo_Font.className}`}
                  >
                    Exchange
                  </span>

                  <div className="absolute z-10  bg-black group-hover:block hidden top-12 left-3 w-[300px]">
                    <div className="px-2 pt-2 pb-4 bg-black shadow-lg">
                      <div className="flex flex-col">
                        <span
                          className={`flex flex-row text-xs text-beige items-center w-full mt-2 text-left bg-transparent rounded-lg md:w-auto md:inline md:mt-0 focus:outline-none ${exo_Font.className}`}
                        ></span>
                        {exchange_base_data.map((list, key) => (
                          <a href={list.link} key={key} target="_blank">
                            <span
                              className={`text-beige cursor-pointer px-4 text-xs hover:text-white ${exo_Font.className}`}
                            >
                              {list.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
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
                  // Note: If your app doesn't use authentication, you
                  // can remove all 'authenticationStatus' checks
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
                              className={`bg-yellow-gradient py-[10px] px-[20px] rounded-[60px] cursor-pointer ${exo_Font.className}`}
                            >
                              Connect Wallet
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button onClick={openChainModal} type="button">
                              Wrong network
                            </button>
                          );
                        }

                        return (
                          <div className="bg-yellow-gradient py-[10px] px-[20px] rounded-[60px] cursor-pointer flex">
                            <button
                              onClick={openChainModal}
                              style={{ display: "flex", alignItems: "center" }}
                              type="button"
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
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
