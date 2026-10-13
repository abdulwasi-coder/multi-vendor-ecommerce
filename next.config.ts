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
  allowedDevOrigins: ['192.168.0.108'],

};

export default nextConfig;
