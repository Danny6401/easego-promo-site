const FLOWER_DOMAIN_HOSTS = new Set([
	"dukeduckflowers.com",
	"www.dukeduckflowers.com",
]);

// 獨立品牌網域首頁會讀取既有的合作店家詳細頁，網址列維持品牌網域。
const FLOWER_DETAIL_PATH = "/cooperation/flower-duke-duck/";

export async function onRequest(context) {
	const url = new URL(context.request.url);
	const host = url.hostname.toLowerCase();
	const isFlowerDomain = FLOWER_DOMAIN_HOSTS.has(host);
	const isDomainRoot = url.pathname === "/" || url.pathname === "/index.html";

	// Serve the flower brand domain from the existing DuDaKe detail page without changing the visitor URL.
	if (isFlowerDomain && isDomainRoot) {
		const rewriteUrl = new URL(context.request.url);
		rewriteUrl.pathname = FLOWER_DETAIL_PATH;

		return context.env.ASSETS.fetch(new Request(rewriteUrl, context.request));
	}

	return context.next();
}
