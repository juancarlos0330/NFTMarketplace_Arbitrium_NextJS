import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import "../global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Audiowide } from "next/font/google";
const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import Header from "@/module/header";
const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [arbitrum, arbitrumSepolia],
  ssr: true,
});

const client = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <ToastContainer />
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <div className={`bg-black ${audiowide.className}`}>
            <Head>
              <title>Fable</title>
            </Head>
            <Header />
            <Component {...pageProps} />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
