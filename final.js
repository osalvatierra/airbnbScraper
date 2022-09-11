import { gotScraping } from "got-scraping";
import cheerio from "cheerio";
import pretty from "pretty";

const WEB_URL = "https://www.goodreads.com/";
const response = await gotScraping(WEB_URL);

const $ = cheerio.load(response.body);

const genresLinksToScrape = [];

for (const genre of $('a[href*="/genres/"]')) {
	const relativeUrl = $(genre).attr("href");
	const absolutUrl = new URL(relativeUrl, WEB_URL);
	genresLinksToScrape.push(absolutUrl.href);
}

// new array to save each genre info in
const results = [];

// optional error array
const errors = [];

for (const url of genresLinksToScrape) {
	try {
		//download HTML of each country page
		const genreResponse = await gotScraping(url);
		const $$ = cheerio.load(genreResponse.body);

		//Collection data logic
		let title = $$('a[class*="bookTitle"]');
		const author = $$('a[class*="authorName"]');
		const desc = $$('div[class*="giveawayDescriptionDetails"] span');
		let item = 0;

		title.each((_, e) => {
			item++;
			let title = $(e).text();
			results.push({
				title,
				item,
			});
		});
		author.each((_, e) => {
			if (item == 3) item = 0;
			item++;
			let author = $(e).text();
			results.push({
				author,
				item,
			});
		});
		desc.each((_, e) => {
			if (item == 3) item = 0;
			item++;
			let description = $(e).text();
			results.push({
				description,
				item,
			});
		});

		console.log(results);
	} catch (error) {
		errors.push({
			url,
			err: error.message,
		});
	}
}

console.log(results);
