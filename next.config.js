/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      "via.placeholder.com",
      "i.seadn.io",
      "ipfs.io",
      "stream.mux.com",
      "openseauserdata.com",
    ],
  },
};

module.exports = nextConfig;
