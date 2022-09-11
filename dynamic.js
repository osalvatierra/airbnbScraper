import { CheerioCrawler } from "crawlee";
import pretty from "pretty";
const BASE_URL = "https://www.goodreads.com";

const crawler = new CheerioCrawler({
    requestHandler: async ({ $, request }) => {
        const products = $('a[href*="/book/"]');

        const results = [...products].map((product) => {
            const elem = $(product);
            console.log(elem.text());

            const title = elem.find(".Text__title1").text();
            const author = elem.find('span[itemprop*="name"]').text();

            return {
                title,
                author,
            };
        });

        console.log(results);
    },
});

await crawler.addRequests([
    { url: "https://www.goodreads.com/shelf/show/science-fiction" },
]);

await crawler.run();
