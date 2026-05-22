const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Use stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

async function readHtml(url) {
    let browser;
    try {
        console.log(`Launching Stealth Browser to fetch: ${url}...`);
        
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled'
            ]
        });

        const page = await browser.newPage();
        
        // Realistic viewport
        await page.setViewport({ width: 1280, height: 800 });

        console.log('Navigating and waiting for Cloudflare verification to pass...');
        
        // Navigate to the URL
        await page.goto(url, { 
            waitUntil: 'networkidle2', 
            timeout: 90000 
        });

        // Add a small extra delay for safety
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Get the page content
        const content = await page.content();
        const $ = cheerio.load(content);
        
        const title = $('title').text() || 'No Title';
        console.log(`\nTitle: ${title}`);

        if (title.includes('Just a moment') || title.includes('Attention Required')) {
            console.log('\n[Warning] Still blocked by Cloudflare. You might need to try again or use a non-headless browser.');
        }

        // Claude specific cleaning
        $('script, style, nav, footer, header, svg, button').remove();

        // Add newlines to block elements
        $('p, div, h1, h2, h3, h4, h5, h6, li, br').append('\n');
        
        const text = $('body').text();

        // Clean up whitespace
        const cleanedText = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');

        const outputText = `Title: ${title}\nURL: ${url}\n\n--- Extracted Text ---\n\n${cleanedText}`;

        console.log('\n--- Extracted Text (Preview) ---\n');
        console.log(cleanedText.substring(0, 500) + (cleanedText.length > 500 ? '...' : ''));
        
        // Save to file
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace(/\./g, '_');
        const fileName = `${domain}_${Date.now()}.txt`;
        const filePath = path.join(__dirname, fileName);

        fs.writeFileSync(filePath, outputText, 'utf8');
        console.log(`\n[Success] Content saved to: ${fileName}`);

    } catch (error) {
        console.error('Error fetching or parsing the URL:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
        console.log('--- Process Finished ---');
    }
}

const url = process.argv[2];
if (!url) {
    console.log('Usage: node index.js <URL>');
} else {
    readHtml(url);
}
