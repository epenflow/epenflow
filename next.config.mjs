import createMDX from "@next/mdx";

const nextConfig = {
	/** @type {import('next').NextConfig} */
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};
const withMDX = createMDX({});

export default withMDX(nextConfig);
