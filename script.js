const puppeteer = require('puppeteer-firefox'); // Use puppeteer-firefox
const { setTimeout } = require('node:timers/promises');
const fs = require('fs');
const path = require('path');

async function extractEmail(page) {
    await setTimeout(4000);
    const email = await page.$eval('div.mb-3.input-group input.form-control-lg.form-control', el => el.value);
    console.log('Extracted email:', email);
    return email;
}

async function saveEmailToFile(email) {
    const filePath = path.join(__dirname, 'screenshots', 'accounts.txt');
    try {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.appendFileSync(filePath, email + '\n');
        console.log('Email saved to accounts.txt in screenshots directory');
    } catch (err) {
        console.error('Error writing to file:', err);
    }
}

async function run() {
    const browser = await puppeteer.launch({ 
        headless: true, // Ensure headless mode
        userDataDir: './firefox-profile',
        timeout: 60000
    });
    const page = await browser.newPage();
    
    await page.goto('https://emailnator.com');
    const email = await extractEmail(page);
    
    await setTimeout(2000);
    await saveEmailToFile(email);
    
    await setTimeout(2000);
    await page.goto('https://www.alwaysdata.com');
    await setTimeout(4000);
    
    await page.click('a.btn.free[href="/en/register/?d"]');
    await setTimeout(4000);
    
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', email);
    
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="password"]', 'Jellyfish90@@@');

    await setTimeout(2000);
    
    await page.waitForSelector('input[name="credit_card_validation"]');
    await page.click('input[name="credit_card_validation"]');

    await setTimeout(2000);
    
    await page.waitForSelector('input[name="privacy_policy"]');
    await page.click('input[name="privacy_policy"]');

    await page.click('button[type="submit"]'); // Click the submit button
    
    await setTimeout(4000);
    await page.screenshot({ path: 'screenshots/screenshot.jpg', type: 'jpeg', fullPage: true });
    
    await browser.close();
}

run().catch(error => {
    console.error('Error:', error);
});
