import { gotScraping } from "got-scraping";
import cheerio from "cheerio";
import pretty from "pretty";

const WEB_URL = "https://www.goodreads.com/";
const response = await gotScraping(WEB_URL);
//const html = response.body;

const $ = cheerio.load(response.body);

const genresLinksToScrape = [];

const genreLinks = $('div#browseBox a[href*="/genres/"]');

for (const link of genreLinks) {
	const relativeUrl = $(link).attr('href');
	const absolutUrl = new URL(relativeUrl, WEB_URL);
	genresLinksToScrape.push(absolutUrl.href);
}

// Loop over stored URLs to process each
// product page individually

for (const link of genresLinksToScrape) {

	try {
	//Download HTML
	const productResponse = await gotScraping(link);
	const productHTML = productResponse.body;

	//load into Cheerio
	const $$ = cheerio.load(productHTML);

	//Extract

	const genreTitleArr = [];
	let genreTitle = $$('a[class*="bookTitle"]');
	console.log(genreTitle.text())
	// genreTitle.each((_, e) => {
	// 	let title = $(e).text();
	// 	console.log(title);
	// })

	//console.log(genreTitle);

} catch (error) {
	console.error(error.message, link);
}
}