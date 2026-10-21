import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    const backendUrl = process.env.Base_Url;
    return backendUrl
      ? [{ source: "/proxy-backend/:path*", destination: `${backendUrl}/:path*` }]
      : [];
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
