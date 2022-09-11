import { PlaywrightCrawler, Dataset } from "crawlee";
import cheerio from "cheerio";

const crawler = new PlaywrightCrawler({
	launchContext: {
		launchOptions: {
			headless: true, // setting headless in code
		},
	},

	requestHandler: async ({ page, request, enqueueLinks }) => {
		const $ = cheerio.load(await page.content());

		if (request.label === "START") {
			await enqueueLinks({
				// The selector is from our earlier code.
				selector: 'a[href*="/genres/"]',
				// The baseUrl option automatically resolves relative URLs.
				baseUrl: new URL(request.url).origin,
			});

			// When on the START page, we don't want to
			// extract any data after we extract the links.
			return;
		}

		//Collection data logic
		let title = $('a[class*="bookTitle"]');
		const author = $('a[class*="authorName"]');
		const desc = $('div[class*="giveawayDescriptionDetails"] span');
		let item = 0;

		title.each((_, e) => {
			item++;
			let title = $(e).text();
			Dataset.pushData({
				title,
				item,
			});
		});
		author.each((_, e) => {
			if (item == 3) item = 0;
			item++;
			let author = $(e).text();
			Dataset.pushData({
				author,
				item,
			});
		});
		desc.each((_, e) => {
			if (item == 3) item = 0;
			item++;
			let description = $(e).text();
			Dataset.pushData({
				description,
				item,
			});
		});
	},
});

await crawler.addRequests([
	{
		url: "https://www.goodreads.com/shelf/show/science-fiction",
		// By labeling the Request, we can very easily
		// identify it later in the requestHandler.
		userData: {
			label: "START",
		},
	},
]);

await crawler.run();
