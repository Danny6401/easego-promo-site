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

const getOptionalText = (value, fallback) =>
	typeof value === "string" && value.trim() ? value.trim() : fallback;

const getCollectionItems = (value, key) => {
	if (Array.isArray(value)) {
		return value;
	}

	return value?.[key] ?? value?.items ?? [];
};

const getCollectionTitle = (value, fallback) =>
	getOptionalText(Array.isArray(value) ? undefined : value?.title, fallback);

const normalizeHomestaySections = (homestay) => {
	const roomsSource = homestay.rooms;
	const bookingRowsSource = homestay.bookingRows;

	// rooms / bookingRows 新格式可包 title，這裡轉回既有陣列結構供頁面共用。
	return {
		...homestay,
		rooms: getCollectionItems(roomsSource, "items"),
		bookingRows: getCollectionItems(bookingRowsSource, "rows"),
		location: homestay.location ?? {},
		sectionTitles: {
			rooms: getCollectionTitle(roomsSource, "客房介紹"),
			booking: getCollectionTitle(bookingRowsSource, "訂房資訊"),
			location: getOptionalText(homestay.location?.title, "民宿位置"),
		},
	};
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
		normalizeHomestaySections({
			...(homestayDetailsBySlug.get(homestay.slug) ?? {}),
			...homestay,
		}),
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
