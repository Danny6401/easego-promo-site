import { imageAssets, sitePath } from "./assets.js";

const organizationId = "#organization";
const websiteId = "#website";

const socialUrls = [
	"https://www.facebook.com/share/1LXYDqdmiq/",
	"https://www.instagram.com/easego.host",
	"https://lin.ee/z6ZmWLH",
];

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

// Schema.org 需要完整 URL，集中轉換可避免各頁漏掉正式網域。
const toAbsoluteUrl = (value, siteUrl) => {
	if (!value) {
		return value;
	}

	if (isAbsoluteUrl(value)) {
		return value;
	}

	return new URL(value, `${siteUrl}/`).toString();
};

const cleanText = (value) => {
	if (typeof value !== "string") {
		return value;
	}

	return value.replace(/\s+/g, " ").trim();
};

const compactObject = (value) =>
	Object.fromEntries(
		Object.entries(value).filter(([, item]) => {
			if (Array.isArray(item)) {
				return item.length > 0;
			}

			return item !== undefined && item !== null && item !== "";
		}),
	);

const uniqueList = (values) => [...new Set(values)];

const parseStartingPrice = (value) => {
	const amount = value?.match(/\d[\d,]*/)?.[0]?.replace(/,/g, "");

	return amount ? Number(amount) : undefined;
};

const parsePositiveInteger = (value) => {
	const amount = String(value ?? "")
		.match(/\d[\d,]*/)?.[0]
		?.replace(/,/g, "");
	const numberValue = amount ? Number(amount) : undefined;

	return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : undefined;
};

const buildAggregateRating = (homestay) => {
	const ratingValue = homestay.rating ? Number(homestay.rating) : undefined;
	const ratingCount = parsePositiveInteger(homestay.ratingCount);
	const reviewCount = parsePositiveInteger(homestay.reviewCount);

	if (!ratingValue || (!ratingCount && !reviewCount)) {
		return undefined;
	}

	// Google 複合式搜尋結果要求 AggregateRating 必須搭配真實的 ratingCount 或 reviewCount。
	return compactObject({
		"@type": "AggregateRating",
		ratingValue,
		bestRating: "5",
		ratingCount,
		reviewCount,
	});
};

const graphDocument = (items) => ({
	"@context": "https://schema.org",
	"@graph": items.filter(Boolean).map(compactObject),
});

const buildBreadcrumbList = ({ breadcrumbs, siteUrl }) => {
	if (!breadcrumbs?.length) {
		return null;
	}

	return {
		"@type": "BreadcrumbList",
		"@id": `${toAbsoluteUrl(breadcrumbs.at(-1).url, siteUrl)}#breadcrumb`,
		itemListElement: breadcrumbs.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: toAbsoluteUrl(item.url, siteUrl),
		})),
	};
};

const buildBaseGraph = ({
	siteUrl,
	canonicalUrl,
	title,
	description,
	imageUrl,
	pageType = "WebPage",
	breadcrumbs = [],
}) => {
	const siteRootUrl = `${siteUrl}/`;
	const logoUrl = toAbsoluteUrl(imageAssets.logo, siteUrl);
	const pageId = `${canonicalUrl}#webpage`;
	const organizationSchemaId = `${siteRootUrl}${organizationId}`;
	const websiteSchemaId = `${siteRootUrl}${websiteId}`;

	return [
		{
			"@type": "Organization",
			"@id": organizationSchemaId,
			name: "Easego 聯合行銷",
			url: siteRootUrl,
			logo: {
				"@type": "ImageObject",
				url: logoUrl,
			},
			areaServed: {
				"@type": "Country",
				name: "Taiwan",
			},
			sameAs: socialUrls,
		},
		{
			"@type": "WebSite",
			"@id": websiteSchemaId,
			name: "Easego 聯合行銷合作旅宿",
			url: siteRootUrl,
			inLanguage: "zh-Hant-TW",
			publisher: { "@id": organizationSchemaId },
		},
		{
			"@type": pageType,
			"@id": pageId,
			url: canonicalUrl,
			name: title,
			description: cleanText(description),
			isPartOf: { "@id": websiteSchemaId },
			about: { "@id": organizationSchemaId },
			primaryImageOfPage: imageUrl
				? {
						"@type": "ImageObject",
						url: toAbsoluteUrl(imageUrl, siteUrl),
					}
				: undefined,
			inLanguage: "zh-Hant-TW",
			breadcrumb: breadcrumbs.length
				? { "@id": `${toAbsoluteUrl(breadcrumbs.at(-1).url, siteUrl)}#breadcrumb` }
				: undefined,
		},
		buildBreadcrumbList({ breadcrumbs, siteUrl }),
	];
};

export const buildHomeSchema = ({ title, description, homestays }) => (context) =>
	graphDocument([
		...buildBaseGraph({
			...context,
			title,
			description,
			imageUrl: imageAssets.heroMap,
			pageType: "CollectionPage",
			breadcrumbs: [{ name: "首頁", url: sitePath() }],
		}),
		{
			"@type": "ItemList",
			"@id": `${context.canonicalUrl}#featured-stays`,
			name: "精選合作旅宿",
			numberOfItems: homestays.length,
			itemListElement: homestays.map((homestay, index) => ({
				"@type": "ListItem",
				position: index + 1,
				url: toAbsoluteUrl(sitePath(`cooperation/${homestay.slug}/`), context.siteUrl),
				name: homestay.name,
			})),
		},
	]);

export const buildCooperationListSchema = ({ title, description, homestays }) => (context) =>
	graphDocument([
		...buildBaseGraph({
			...context,
			title,
			description,
			imageUrl: context.metaImage,
			pageType: "CollectionPage",
			breadcrumbs: [
				{ name: "首頁", url: sitePath() },
				{ name: "合作旅宿", url: sitePath("cooperation/") },
			],
		}),
		{
			"@type": "ItemList",
			"@id": `${context.canonicalUrl}#homestay-list`,
			name: "Easego 合作旅宿列表",
			numberOfItems: homestays.length,
			itemListElement: homestays.map((homestay, index) => ({
				"@type": "ListItem",
				position: index + 1,
				url: toAbsoluteUrl(sitePath(`cooperation/${homestay.slug}/`), context.siteUrl),
				name: homestay.name,
			})),
		},
	]);

export const buildRegionSchema = ({ title, description, region }) => (context) =>
	graphDocument([
		...buildBaseGraph({
			...context,
			title,
			description,
			imageUrl: region.homestays[0]?.coverImage ?? context.metaImage,
			pageType: "CollectionPage",
			breadcrumbs: [
				{ name: "首頁", url: sitePath() },
				{ name: "合作旅宿", url: sitePath("cooperation/") },
				{ name: `${region.label}合作旅宿`, url: sitePath(`cooperation/region/${region.id}/`) },
			],
		}),
		{
			"@type": "ItemList",
			"@id": `${context.canonicalUrl}#region-homestays`,
			name: `${region.label}合作旅宿`,
			numberOfItems: region.homestays.length,
			itemListElement: region.homestays.map((homestay, index) => ({
				"@type": "ListItem",
				position: index + 1,
				url: toAbsoluteUrl(sitePath(`cooperation/${homestay.slug}/`), context.siteUrl),
				name: homestay.name,
			})),
		},
	]);

export const buildHomestaySchema = ({ title, description, homestay }) => (context) => {
	const homestayUrl = toAbsoluteUrl(sitePath(`cooperation/${homestay.slug}/`), context.siteUrl);
	const offerPrice = parseStartingPrice(homestay.startingPrice);
	const validLinks = Object.values(homestay.links ?? {}).filter(
		(link) => link && isAbsoluteUrl(link.trim()),
	);

	return graphDocument([
		...buildBaseGraph({
			...context,
			title,
			description,
			imageUrl: homestay.coverImage,
			pageType: "WebPage",
			breadcrumbs: [
				{ name: "首頁", url: sitePath() },
				{ name: "合作旅宿", url: sitePath("cooperation/") },
				{
					name: `${homestay.regionLabel ?? homestay.region}合作旅宿`,
					url: sitePath(`cooperation/region/${homestay.regionId}/`),
				},
				{ name: homestay.name, url: sitePath(`cooperation/${homestay.slug}/`) },
			],
		}),
		{
			"@type": "LodgingBusiness",
			"@id": `${homestayUrl}#lodging`,
			name: homestay.name,
			alternateName: homestay.englishName,
			url: homestayUrl,
			image: uniqueList([homestay.coverImage, homestay.aboutImage].filter(Boolean))
				.map((item) => toAbsoluteUrl(item, context.siteUrl)),
			description: cleanText(homestay.summary || homestay.about),
			address: homestay.address
				? {
						"@type": "PostalAddress",
						streetAddress: homestay.address,
						addressLocality: homestay.area,
						addressCountry: "TW",
					}
				: undefined,
			aggregateRating: buildAggregateRating(homestay),
			amenityFeature: homestay.features?.map((feature) => ({
				"@type": "LocationFeatureSpecification",
				name: feature,
				value: true,
			})),
			makesOffer: homestay.rooms?.map((room) => ({
				"@type": "Offer",
				name: room.name,
				description: cleanText(room.description),
				priceSpecification: offerPrice
					? {
							"@type": "PriceSpecification",
							price: offerPrice,
							priceCurrency: "TWD",
						}
					: undefined,
			})),
			sameAs: validLinks,
		},
	]);
};
