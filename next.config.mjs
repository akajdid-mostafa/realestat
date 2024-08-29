/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/login',
          destination: '/Index',
          permanent: true,
        },
      ];
    },
  };
  
  export default nextConfig;
  