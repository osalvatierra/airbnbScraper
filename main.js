import { gotScraping } from 'got-scraping';
import cheerio from 'cheerio';

const getResults = async () => {

try {
const response = await gotScraping('https://www.airbnb.com/s/Park-Slope--New-York--United-States/homes');
const html = response.body;

const $ = cheerio.load(html);
const products = $('div[class*="c4mnd7m"]');

const results = [];

for (const product of products) {
	const element = $(product);

	let title = $(element).find('div[class*="n1v28t5c"]').text();
	let price = $(element).find('span[class*="a8jt5op"]').text();
	
	results.push({
		title,
		price,
	})

}
;
return results;

} catch(error) {
	throw error;
}

}

getResults().then((titlesAndPrices) => console.log(titlesAndPrices));