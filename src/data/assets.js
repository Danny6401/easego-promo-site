const baseUrl = import.meta.env.BASE_URL.endsWith("/")
	? import.meta.env.BASE_URL
	: `${import.meta.env.BASE_URL}/`;

const trimLeadingSlash = (path) => path.replace(/^\/+/, "");

export const sitePath = (path = "") => `${baseUrl}${trimLeadingSlash(path)}`;

export const r2BaseUrl = import.meta.env.PUBLIC_R2_BASE_URL?.replace(/\/+$/, "") ?? "";

export const r2AssetUrl = (path) => {
	if (!r2BaseUrl) {
		throw new Error("Missing PUBLIC_R2_BASE_URL. Set it to your R2 public bucket URL.");
	}

	return `${r2BaseUrl}/${trimLeadingSlash(path)}`;
};

export const imageAssets = {
	logo: sitePath("easegoLogo.png"),
	heroMap: sitePath("taiwan-map-hero.png"),
	ctaPanel: sitePath("cta-panel-transparent.png"),
	ctaPanelOpaque: sitePath("cta-panel.png"),
	ctaHandshake: sitePath("cta-handshake.png"),
	advantages: sitePath("advantages.png"),
	advantageIcon: (icon) => sitePath(`advantage-icons/${icon}.png`),
};

export const getHomestayImagesUrl = (slug) => r2AssetUrl(`homestays/${slug}/images.json`);
export const getHomestayDetailUrl = (slug) => r2AssetUrl(`homestays/${slug}/detail.json`);

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

const resolveImagePath = (value, basePath) => {
	if (!value) {
		return value;
	}

	if (isAbsoluteUrl(value)) {
		return value;
	}

	return r2AssetUrl(`${basePath}/${value}`);
};

const resolveImageList = (values, basePath) =>
	values?.map((value) => resolveImagePath(value, basePath));

const resolveNestedImageList = (groups, basePath) =>
	groups?.map((values) => resolveImageList(values, basePath));

export const applyHomestayImages = (homestay, images) => {
	if (!images) {
		return homestay;
	}

	const basePath = images.basePath ?? `homestays/${homestay.slug}/images`;

	return {
		...homestay,
		logo: resolveImagePath(images.logo, basePath) ?? homestay.logo,
		coverImage: resolveImagePath(images.coverImage, basePath) ?? homestay.coverImage,
		aboutImage: resolveImagePath(images.aboutImage, basePath) ?? homestay.aboutImage,
		slides: homestay.slides.map((slide, index) => ({
			...slide,
			image: resolveImagePath(images.slides?.[index], basePath) ?? slide.image,
		})),
		news: homestay.news.map((item, index) => ({
			...item,
			image: resolveImagePath(images.news?.[index], basePath) ?? item.image,
		})),
		rooms: homestay.rooms.map((room, index) => ({
			...room,
			images: resolveNestedImageList(images.rooms, basePath)?.[index] ?? room.images,
		})),
		detailImages: images.detailImages
			? Object.fromEntries(
					Object.entries(images.detailImages).map(([key, value]) => [
						key,
						resolveImagePath(value, basePath),
					]),
				)
			: homestay.detailImages,
		location: {
			...homestay.location,
			mapImage: resolveImagePath(images.locationMap, basePath) ?? homestay.location.mapImage,
		},
	};
};

export const externalIconUrls = {
	booking: "https://www.google.com/s2/favicons?sz=64&domain=booking.com",
	agoda: "https://www.google.com/s2/favicons?sz=64&domain=agoda.com",
	eztravel: "https://www.google.com/s2/favicons?sz=64&domain=eztravel.com.tw",
	trip: "https://www.google.com/s2/favicons?sz=64&domain=trip.com",
	facebook: "https://www.google.com/s2/favicons?sz=64&domain=facebook.com",
	instagram: "https://www.google.com/s2/favicons?sz=64&domain=instagram.com",
	line: "https://www.google.com/s2/favicons?sz=64&domain=line.me",
};
