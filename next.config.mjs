import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  serverExternalPackages: ["@takumi-rs/image-response"],
  images: {
    unoptimized: true,
  },
};

export default withMDX(config);
