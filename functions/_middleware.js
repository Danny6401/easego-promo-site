const customDomainRoutes = new Map([
	// 獨立品牌網域首頁會讀取既有的合作店家詳細頁，網址列維持品牌網域。
	["dukeduckflowers.com", "/cooperation/flower-duke-duck/"],
	["www.dukeduckflowers.com", "/cooperation/flower-duke-duck/"],
]);

export async function onRequest(context) {
	const url = new URL(context.request.url);
	const host = url.hostname.toLowerCase();
	const customDetailPath = customDomainRoutes.get(host);
	const isDomainRoot = url.pathname === "/" || url.pathname === "/index.html";

	if (customDetailPath && isDomainRoot) {
		const rewriteUrl = new URL(context.request.url);
		rewriteUrl.pathname = customDetailPath;

		return context.env.ASSETS.fetch(new Request(rewriteUrl, context.request));
	}

	return context.next();
}
