/**
 * Resolves a target URL relative to a base URL
 *
 * @see https://nodejs.org/dist/latest-v14.x/docs/api/url.html#url_url_resolve_from_to
 *
 * @param {string} from
 * @param {string} to
 * @returns {string}
 */
export function resolve(from, to) {
	const resolvedUrl = new URL(to, new URL(from, 'resolve://'));

	if (resolvedUrl.protocol === 'resolve:') {
		const { pathname, search, hash } = resolvedUrl;
		return pathname + search + hash;
	}

	return resolvedUrl.toString();
}
