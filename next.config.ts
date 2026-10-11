import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:'://unsplash.com',
        port:"",
        pathname:'/**'
      }
    ]
  },
  allowedDevOrigins: ['192.168.0.108'],

};

export default nextConfig;
