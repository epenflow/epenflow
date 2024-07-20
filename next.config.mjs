/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'njkigyqrisocubaoiars.supabase.co',
				port: '',
				pathname: '/storage/v1/object/public/files/uploads/**',
			},
		],
	},
};

export default nextConfig;
