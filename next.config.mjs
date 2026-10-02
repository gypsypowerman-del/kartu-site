/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: deployable to Vercel, Netlify or any static host. Switch off when the CMS/API routes land.
  output: process.env.STATIC_EXPORT === "0" ? undefined : "export",
  trailingSlash: true,
  images: { unoptimized: true }, // images are pre-optimised by `npm run images`
  basePath: process.env.BASE_PATH || "",
};
export default nextConfig;
