// Safe Link Decoder
// Version 2.0
// https://github.com/edavenp9/Safe-Link-Decoder

/**
 * Regular expression that matches the (encoded) original URL within one or more Safe Links.
 * If matching multiple Safe Links, separate each URL using newlines, whitespace, commas, single/double quotes, or any combination thereof.
 * * NOTE: Requires positive lookbehind support
 * @example "http://nam1.safelinks.protection.outlook.com/?url=http%3A%2F%2Fa.b&data=a".match(extractInnerLinks);
 * @constant
 * @type {RegExp}
 */
const extractInnerLinks = /(?<=https?:\/\/nam\d+\.safelinks\.protection\.outlook\.com[\w\/%~-]*?\/\?url=)https?%3A%2F%2F[\w%~!-]+(?:\.[\w%~!-]+)+(?=&(?:amp;)?data=[\w%\.-]+(?:&(?:amp;)?sdata=[\w%\.-]+)?(?:&(?:amp;)?reserved=\d+)?[\s,'"]*)/g;

/**
 * Given a string containing one or more Safe Links, find the original URL(s) and return the results as an Array.
 * @param {string} input - A string containing one or more Safe Links.
 * @returns {string[]} An array containing the decoded URLs. If no Safe Links were found in the string, an empty Array is returned.
 * @throws {TypeError} Argument must be a string.
 */
function decode(input) {
	"use strict";

	let encodedURLs; // Array of RegExp matches containing (encoded) original URLs.
	let results = []; // Array containing decoded original URLs.

	// Error checking.
	if (typeof input != 'string') throw new TypeError('Argument error: string expected');

	// Execute RegEx and save the Array of matches.
	encodedURLs = input.match(extractInnerLinks);

	// Return empty Array if no results found.
	if (encodedURLs === null) return [];

	// If there were results, decode the URLs and push them onto results[].
	for (const enURL of encodedURLs) {
		results.push(decodeURIComponent(enURL));
	}

	// All done.
	return results;

}

export { decode };