import {
	applyHomestayImages,
	getHomestayDetailUrl,
	getHomestayImagesUrl,
} from "./assets.js";
import cooperationRegions from "./cooperation-regions.json";
import homestayIndex from "./homestay-index.json";

const fetchJson = async (url) => {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
	}

	return response.json();
};

const homestayDetailsBySlug = new Map(
	await Promise.all(
		homestayIndex.map(async ({ slug }) => [
			slug,
			await fetchJson(getHomestayDetailUrl(slug)),
		]),
	),
);

const homestayImagesBySlug = new Map(
	await Promise.all(
		homestayIndex.map(async ({ slug }) => [
			slug,
			await fetchJson(getHomestayImagesUrl(slug)),
		]),
	),
);

const homestaysBySlug = new Map(
	homestayIndex.map((homestay) => [
		homestay.slug,
		{
			...(homestayDetailsBySlug.get(homestay.slug) ?? {}),
			...homestay,
		},
	]),
);

export const cooperationData = cooperationRegions;

export const getRegions = () =>
	cooperationRegions.regions.map((region) => ({
		...region,
		homestays: region.homestaySlugs
			.map((slug) => homestaysBySlug.get(slug))
			.filter(Boolean)
			.map((homestay) => applyHomestayImages(homestay, homestayImagesBySlug.get(homestay.slug))),
	}));

export const getAllHomestays = () =>
	getRegions().flatMap((region) => region.homestays);

export const getAllHomestaysWithRegions = () =>
	getRegions().flatMap((region) =>
		region.homestays.map((homestay) => ({
			...homestay,
			regionId: region.id,
			regionLabel: region.label,
		})),
	);

export const getHomestayMap = () =>
	new Map(getAllHomestays().map((homestay) => [homestay.slug, homestay]));

export const getHomestayBySlug = (slug) =>
	getAllHomestaysWithRegions().find((homestay) => homestay.slug === slug);

export const getFeaturedHomestay = () =>
	getHomestayBySlug(cooperationRegions.featuredSlug) ?? getAllHomestaysWithRegions()[0];

export const getRegionById = (id) =>
	getRegions().find((region) => region.id === id) ?? getRegions()[0];

export const getRegionStaticPaths = () =>
	getRegions().map((region) => ({
		params: { id: region.id },
	}));

export const getHomestayStaticPaths = () =>
	getAllHomestays().map((homestay) => ({
		params: { slug: homestay.slug },
	}));
