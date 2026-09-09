// File: scraper.js
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs';

// The base URL for the activities pages
const BASE_URL = 'https://www.mohanfoundation.org/activities/organ-donation-ambassador.asp';
const TOTAL_PAGES = 73;

async function scrapeAllStories() {
    const allStories = [];
    console.log(`Starting to scrape ${TOTAL_PAGES} pages...`);

    for (let i = 1; i <= TOTAL_PAGES; i++) {
        try {
            const url = `${BASE_URL}?page=${i}`;
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to fetch page ${i}. Status: ${response.status}`);
                continue; // Skip to the next page
            }
            const html = await response.text();
            const $ = cheerio.load(html);

            // Find all list items that represent a story
            $('ul.media-list > li.media.brd-btm-dot').each((index, element) => {
                const story = {};
                const mediaBody = $(element).find('.media-body');
                
                story.title = mediaBody.find('h4.media-heading a').text().trim();
                story.link = mediaBody.find('h4.media-heading a').attr('href');
                
                // Make link absolute if it's relative
                if (story.link && !story.link.startsWith('http')) {
                    story.link = `<https://www.mohanfoundation.org/activities/${story.link}>`;
                }

                const dateString = mediaBody.find('span.span-color').text().trim();
                story.date = new Date(dateString).toISOString().split('T')[0]; // Format as YYYY-MM-DD

                story.description = mediaBody.find('p').first().text().trim().replace(/\s\s+/g, ' ');
                
                const imageSrc = $(element).find('.media-left img').attr('src');
                if (imageSrc && !imageSrc.startsWith('http')) {
                    story.image = `<https://www.mohanfoundation.org/${imageSrc}>`;
                } else {
                    story.image = imageSrc;
                }

                allStories.push(story);
            });

            console.log(`Successfully scraped page ${i} of ${TOTAL_PAGES}. Found ${allStories.length} stories so far.`);
            // Be a good web citizen and wait a bit between requests
            await new Promise(resolve => setTimeout(resolve, 200)); 

        } catch (error) {
            console.error(`An error occurred while scraping page ${i}:`, error);
        }
    }

    // Save the data to a JSON file
    fs.writeFileSync('stories_data.json', JSON.stringify(allStories, null, 2));
    console.log(`\nScraping complete! All ${allStories.length} stories have been saved to stories_data.json`);
}

scrapeAllStories();
