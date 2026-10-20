import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_Base_Url;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_Base_Url must be configured to enable backend rewrites.");
    }
    return [{ source: "/proxy-backend/:path*", destination: backendUrl }];
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
