import crops from '/public/crops.png';
import FLAYER01 from '/public/FLAYER01.png';
import LOGOmandala from '/public/LOGOmandala.png';
import TM_ig from '/public/TM_ig.png';
import horizon from '/public/horizon.png';
import LOGO_BS from '/public/LOGO_BS.svg';
import sura from '/public/sura.png';
import random_art from '/public/random_art.png';
import { StaticImageData } from 'next/image';

export type TRecentWorks = {
	title: string;
	category: string;
	client: string;
	year: number;
	images: StaticImageData;
};
export const RECENT_WORKS: Array<TRecentWorks> = [
	{
		category: 'branding, visual identity',
		client: 'crops babershop',
		year: 2023,
		images: crops,
		title: 'crops babershop new type mark',
	},
	{
		category: 'branding, poster event',
		client: 'cheersbray',
		images: FLAYER01,
		title: 'amnesia vol 1/cheersbray',
		year: 2022,
	},
	{
		category: 'branding, visual identity event',
		client: '-',
		images: LOGOmandala,
		title: '47 mandala art',
		year: 2023,
	},
	{
		category: 'branding, visual identity',
		client: 'taman teman',
		images: TM_ig,
		title: 'TM taman teman',
		year: 2023,
	},
	{
		category: 'branding, visual identity',
		client: 'horizon fit club',
		images: horizon,
		title: 'horizon fit club',
		year: 2023,
	},
	{
		category: 'branding, vidual identity',
		client: 'bangli skatepark',
		images: LOGO_BS,
		title: 'bangli skatepark',
		year: 2021,
	},
	{
		category: 'branding, visual identity',
		client: 'sura konveksi',
		images: sura,
		title: 'bubble logo sura konveksi',
		year: 2023,
	},
	{
		category: 'visual identity, art',
		client: '-',
		images: random_art,
		title: 'random art',
		year: 2022,
	},
];
