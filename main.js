import { gotScraping } from "got-scraping";
import cheerio from "cheerio";
import pretty from "pretty";
import { parse } from "json2csv";
import { writeFileSync } from "fs";

const getResults = async () => {
	const URL = "https://www.goodreads.com/shelf/show/science-fiction";
	try {
		const response = await gotScraping({
			url: URL,
			headerGeneratorOptions: {
				browsers: [
					{
						name: "chrome",
						minVersion: 87,
						maxVersion: 104,
					},
				],
				devices: ["desktop"],
				locales: ["de-DE", "en-US"],
				operatingSystems: ["windows", "linux", "mac"],
			},
		});
		const html = response.body;

		const $ = cheerio.load(html);
		const products = $('div[class*="elementList"]');
		const productText = products.text();
		const results = [];
		//console.log(productText);

		for (const product of products) {
			const element = $(product);

			// console.log(element)

			let Book = pretty(element.find(".bookTitle").text());
			let Aurthor = element.find('span[itemprop*="name"]').text();

			results.push({
				Book,
				Aurthor,
			});
		}
		const csv = parse(results);
		writeFileSync("products.csv", csv);
	} catch (error) {
		throw error;
	}
};

getResults().then((titlesAndPrices) => console.log(titlesAndPrices));
