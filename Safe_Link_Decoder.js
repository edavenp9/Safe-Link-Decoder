// Safe Link Decoder
// Version 1.0.3
// https://github.com/edavenp9/Safe-Link-Decoder

// Regular Expression (to be used in decodeSafeLink())
// NOTE: Requires positive lookbehind support in browser
// Matches the (encoded) original URL in one or more SafeLinks
// If matching multiple Safe Links, separate individual URLs using newlines, whitespace, commas, single/double quotes, or any combination thereof.
// Shortest possible match: "http://nam1.safelinks.protection.outlook.com/?url=http%3A%2F%2Fa.b&data=a"
const findInnerSafelinks = /(?<=https?:\/\/nam\d+\.safelinks\.protection\.outlook\.com[\w\/%~-]*?\/\?url=)https?%3A%2F%2F[\w%~-]+(?:\.[\w%~-]+)+(?=&(?:amp;)?data=[\w%\.-]+(?:&(?:amp;)?sdata=[\w%\.-]+)?(?:&(?:amp;)?reserved=\d+)?[\s,'"]*)/g;

function decodeSafeLink(badLinks, returnMode) {
	"use strict";

	// Returns a list of all URLs that were able to be extracted from the given list of Safe Links (formatted either as a string or an Array).
	// By default, the return value will match the type of the given list (decodeSafeLink('') = string out / decodeSafeLink([]) = Array out).
	// Optionally, a returnMode value can be provided. This can be used to force output to a string or an Array, depending on requirements.
	// -----
	// badLinks - string or array of "bad" SafeLinks to decode
	// returnMode - specify how results are returned
	// 		0 - Automatic. returnMode will be set to mode 1 if input is a string, or mode 2 if it's an array.
	//		1 - Always return as a string. Multiple results (if any) are separated by newlines.
	//		2 - Always return as an array.
	// -----
	// 
	// Edge case returns: -----------------------------------------
	//                    |        Error        |   No results    | 
	//     returnMode     |---------------------|-----------------|
	//      0 (or other)  |    throw error up   |       n/a       |
	//                 1  | err message string  |  'No results'   |
	//                 2  |         null        |   Empty Array   |
	//                    -----------------------------------------
	// 
	// String mode is intended to be used to directly output UI text, whereas Array mode is more useful for integrating decodeSafeLink() into a larger JavaScript program.
	// Note that if an error occurs when returnMode is 0 or something unrecognized, the caught error will always be passed up.

	returnMode ??= 0; // Set returnMode to 0 if not defined in argument
	let encodedURLs; // Stores Array of RegEx matches
	let results = []; // Stores Array of results

	try {

		// Handle returnMode & validate input

		if (returnMode !== 0 && returnMode !== 1 && returnMode !== 2) {
			// Error checking for returnMode
			throw new RangeError('Argument error: Invalid return mode. Must be 0 (default/auto), 1 (force string), or 2 (force array).');
		}

		if (badLinks instanceof Array) {
			// Convert Array to string if needed
			badLinks = badLinks.join('\n');
			if (returnMode === 0) {
				// Auto-set returnMode
				returnMode = 2;
			}
		} else if (typeof badLinks == 'string') {
			if (returnMode === 0) {
				// Auto-set returnMode
				returnMode = 1;
			}
		} else {
			throw new TypeError('Argument error: Expected string or Array, got ' + typeof badLinks + ': ' + badLinks.toString());
		}

		//if (badLinks.length < 73) {
		//	// Warn if provided string is too short to possibly match
		//	console.warn('Warning: Input is too short to contain a Safe Link. Expected length >= 73, got ' + badLinks.length);
		//}

	} catch (e) {
		// Error handling

		console.error(e); // Forward error to console

		switch (returnMode) {
			case 1:
				return 'Error - Safe Link decode failed!\nDebug info logged to console.'; // User-friendly error message
			case 2:
				return null;
			default:
				throw e;
		}
	}

	// Execute RegEx and save the Array of matches
	encodedURLs = badLinks.match(findInnerSafelinks);

	// If no matches were found...
	if (encodedURLs === null) {
		switch (returnMode) {
			case 1:
				return 'No results';
			case 2:
				return [];
		}
	}

	// Decode retreived URLs and store to results
	for (const enURL of encodedURLs) {
		results.push(decodeURIComponent(enURL));
	}

	//console.info('Decode completed. ' + results.length + ' Safe Link(s) were processed successfully.');

	// Return results
	switch (returnMode) {
		case 1:
			return results.join('\n'); // Return newline separated string containing all results
		case 2:
			return results; // Return Array as-is
	}
}