const puppeteer = require('puppeteer');
const { setTimeout } = require('node:timers/promises');
const fs = require('fs');
const path = require('path');

async function extractEmail(page) {
    await setTimeout(4000); // Wait for 4 seconds
    const email = await page.$eval('div.mb-3.input-group input.form-control-lg.form-control', el => el.value);
    console.log('Extracted email:', email);
    return email;
}

async function saveEmailToFile(email) {
    const filePath = path.join(__dirname, 'screenshots', 'accounts.txt'); // Save in screenshots directory
    try {
        // Ensure the directory exists
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.appendFileSync(filePath, email + '\n');
        console.log('Email saved to accounts.txt in screenshots directory');
    } catch (err) {
        console.error('Error writing to file:', err);
    }
}

async function runIteration(iteration) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--window-size=1280,800',
        ],
    }); // Fixed closing bracket

    const page = await browser.newPage();
    
    // Navigate to emailnator.com
    await page.goto('https://emailnator.com');
    
    // Extract email from the page
    const email = await extractEmail(page);

    await setTimeout(2000); // Wait for 2 seconds before saving the email
    
    // Save the extracted email to accounts.txt
    await saveEmailToFile(email);

    await setTimeout(2000); // Wait for 2 seconds to let the next page load
    
    // Navigate to alwaysdata.com
    await page.goto('https://www.alwaysdata.com');
    await setTimeout(4000); // Wait for 4 seconds before clicking the button

    // Click the register button
    await page.click('a.btn.free[href="/en/register/?d"]');
    await setTimeout(4000); // Wait for 4 seconds to let the next page load

    // Populate the email input
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', email);
    
    // Populate the password input
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="password"]', 'Jellyfish90@@@');

    await setTimeout(2000); // Wait for 2 seconds

    // Check the credit card validation checkbox
    await page.waitForSelector('input[name="credit_card_validation"]');
    await page.click('input[name="credit_card_validation"]'); // Check the checkbox

    await setTimeout(2000); // Wait for 2 seconds

    // Check the privacy policy checkbox
    await page.waitForSelector('input[name="privacy_policy"]');
    await page.click('input[name="privacy_policy"]'); // Check the checkbox

    await setTimeout(2000); // Wait for 2 seconds

    // Click the span with text "Create my profile"
    await page.waitForSelector('button[type="submit"] span'); // Wait for the span to be visible
    await page.click('button[type="submit"] span'); // Click the span directly

    // Wait before taking a full-page screenshot
    await setTimeout(4000); // Wait for 4 seconds before taking a screenshot
    await page.screenshot({ path: `screenshot-${iteration}.jpg`, type: 'jpeg', fullPage: true });
    
    console.log(`Completed iteration ${iteration}/2`);
    await browser.close();
}

async function run() {
    for (let i = 1; i <= 2; i++) {
        await runIteration(i);
    }
}

run().catch(error => {
    console.error('Error:', error);
});
