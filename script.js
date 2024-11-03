const puppeteer = require('puppeteer');
const { setTimeout } = require('node:timers/promises');

async function extractEmail(page) {
    await setTimeout(4000); // Wait for 4 seconds
    const email = await page.$eval('div.mb-3.input-group input.form-control-lg.form-control', el => el.value);
    console.log('Extracted email:', email);
    return email;
}

async function run() {
    const browser = await puppeteer.launch({ headless: true, userDataDir: './chrome-profile' });
    const page = await browser.newPage();
    
    // Navigate to emailnator.com
    await page.goto('https://emailnator.com');
    
    // Extract email from the page
    const email = await extractEmail(page);
    
    // Navigate to alwaysdata.com
    await page.goto('https://www.alwaysdata.com');
    await setTimeout(4000); // Wait for 4 seconds before clicking the button

    // Click the register button
    await page.click('a.btn.free[href="/en/register/?d"]');
    await setTimeout(4000); // Wait for 4 seconds to let the next page load

    // Populate the email input
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', email);

    await setTimeout(3000); // Wait for 4 seconds to let the next page load
    
    // Populate the password input
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="password"]', 'Jellyfish90@@@');

    await setTimeout(3000); // Wait for 4 seconds to let the next page load

    // Check the credit card validation checkbox
    await page.waitForSelector('input[name="credit_card_validation"]');
    await page.click('input[name="credit_card_validation"]'); // Check the checkbox

    await setTimeout(2000); // Wait for 4 seconds to let the next page load

    // Check the privacy policy checkbox
    await page.waitForSelector('input[name="privacy_policy"]');
    await page.click('input[name="privacy_policy"]'); // Check the checkbox

    // Wait before taking a full-page screenshot
    await setTimeout(3000); // Wait for 3 seconds before taking a screenshot
    await page.screenshot({ path: 'screenshot.jpg', type: 'jpeg', fullPage: true });
    
    await browser.close();
}

run().catch(error => console.error('Error:', error));
