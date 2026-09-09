# File: scraper.py
import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime

# The base URL for the activities pages
BASE_URL = 'https://www.mohanfoundation.org/organ-donation-ambassador.asp'
TOTAL_PAGES = 73

def scrape_all_stories():
    """
    Scrapes all ambassador stories from the MOHAN Foundation website
    and saves them to a JSON file.
    """
    all_stories = []
    print(f"Starting to scrape {TOTAL_PAGES} pages...")

    for i in range(1, TOTAL_PAGES + 1):
        try:
            url = f"{BASE_URL}?page={i}"
            response = requests.get(url, timeout=15)
            response.raise_for_status()  # Will raise an HTTPError for bad responses (4xx or 5xx)

            soup = BeautifulSoup(response.text, 'html.parser')

            # Find all list items that represent a story.
            # The HTML has nested <ul>s, so we find the direct children of the main list.
            tab_content = soup.find('div', id='Tab2')
            if not tab_content:
                print(f"Could not find 'Tab2' on page {i}. Skipping.")
                continue
            # The HTML is messy with nested <ul>s. Find all <li>s directly.
            story_elements = tab_content.find_all('li', class_='media brd-btm-dot')

            for element in story_elements:
                story = {}
                media_body = element.find('div', class_='media-body')
                if not media_body:
                    continue

                heading_link = media_body.find('h4', class_='media-heading').find('a')
                story['title'] = heading_link.text.strip()
                
                link = heading_link['href']
                # Make link absolute if it's relative
                if link and not link.startswith('http'):
                    story['link'] = f"https://www.mohanfoundation.org/activities/{link}"
                else:
                    story['link'] = link

                date_string = media_body.find('span', class_='span-color').text.strip()
                # Parse date like "Monday, April 27, 2026"
                story['date'] = datetime.strptime(date_string, '%A, %B %d, %Y').strftime('%Y-%m-%d')

                story['description'] = media_body.find('p').text.strip().replace('\n', ' ').replace('\r', '').replace('\t', ' ').replace('....', '...')
                
                image_tag = element.find('div', class_='media-left').find('img')
                image_src = image_tag['src'] if image_tag else ''
                # Make image src absolute if it's relative
                if image_src and not image_src.startswith('http'):
                    story['image'] = f"https://www.mohanfoundation.org/{image_src}"
                else:
                    story['image'] = image_src

                all_stories.append(story)

            print(f"Successfully scraped page {i} of {TOTAL_PAGES}. Found {len(all_stories)} stories so far.")
            # Be a good web citizen and wait a bit between requests
            time.sleep(0.2)

        except requests.exceptions.RequestException as e:
            print(f"An error occurred while scraping page {i}: {e}")
        except Exception as e:
            print(f"An error occurred processing page {i}: {e}")


    # Save the data to a JSON file
    with open('stories_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_stories, f, indent=2, ensure_ascii=False)
    
    print(f"\nScraping complete! All {len(all_stories)} stories have been saved to stories_data.json")

if __name__ == "__main__":
    scrape_all_stories()
