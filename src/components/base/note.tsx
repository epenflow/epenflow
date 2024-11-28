"use client";
import { Terminal } from "@/components/base/terminal";
import { useNavbar } from "@/hooks/use-navbar";

export const Note = () => {
	const { isNote } = useNavbar();
	if (isNote) {
		return (
			<Terminal className="p-2 text-2xl font-medium" header="Note">
				<p>
					Dear visitor, /* As the developer behind the scenes💻, I’m
					thrilled to share some exciting news with you. Our brand-new
					website, is currently under construction.🚧 The virtual
					blueprints📑 are laid out, the pixels are aligning, and the
					code is humming with anticipation. We’re crafting an online
					space where creativity will flow like a gentle stream, where
					ideas will blossom, and where inspiration will find its
					home. In the coming days📆, you’ll witness the
					transformation – a metamorphosis of design, functionality,
					and purpose. It’s like planting seeds🌱 in a digital
					garden🌲, tending to them with care, and watching them bloom
					into something extraordinary🌼. So, dear visitors, bear with
					us as we hammer away at the keyboard, paint with pixels, and
					sculpt🗿 the future. Your patience is our fuel, and your
					curiosity is our compass🧭. Thank you for being part of this
					journey. Together, we’re building more than a website; we’re
					creating a digital sanctuary.*/
				</p>
			</Terminal>
		);
	}
	return null;
};
