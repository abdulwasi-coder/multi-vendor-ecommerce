import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [{ source: "/vendorsignup", destination: "/customer/signup" }];
  },

  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:'images.unsplash.com',
        port:"",
        pathname:'/**'
      }
    ]
  },
 allowedDevOrigins: ['100.97.73.17'],

};

export default nextConfig;
