const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.qld.gov.au/');

    await page.screenshot( {path: 'homepage.png'});
    await page.screenshot( {path: 'homepage-full.png', fullPage: true});
    await page.pdf( {path: 'homepage.pdf', format: 'A4'});

    //const html = await page.content();
    //console.log(html); //displays all html on the page

    const title = await page.evaluate(() => document.title);
    console.log(title); // displays page title 

    const text = await page.evaluate(() => document.body.innerText);
    console.log(text); //displays all text on the page


    const links = await page.evaluate(() => 
    Array.from(document.querySelectorAll('a'), (e)=> e.href));
    console.log(links); //displays all links on the page
    
    const franchises = await page.evaluate(() =>
        Array.from(document.querySelectorAll('#qg-content .qg-card-columns .qg-card'), (e) => ({ 
        title: e.querySelector('.qg-card-body .qg-card-title').innerText,
        link: e.querySelector('a').href,
        img: e.querySelector('img').src,
        }))
    );

    console.log(franchises); // displays all franchises with title, link and image
    
    //Save data to a json file
    fs.writeFile('franchises.json', JSON.stringify(franchises), (err) => {
        if(err) throw new err;
        console.log('File saved!');
    });

    await browser.close();
}

run();