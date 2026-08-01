module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/Index',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'], // Add the Cloudinary domain here
  },
};
