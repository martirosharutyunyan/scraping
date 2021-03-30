require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const puppeteer =  require("puppeteer");
const app = express();
const port = process.env.PORT;

const screenshot = async () => {
    // const browser = await puppeteer.launch({headless: false});
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://google.com");
    await page.setViewport({ width: 1000, height: 500 });
    await page.screenshot({ path: "google.png" });

    await browser.close();
};

const scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    // const browser = await puppeteer.launch();
    
    const page = await browser.newPage();
    await page.goto("http://books.toscrape.com/");
    await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img')
    await page.waitFor(1000);
    const result = await page.evaluate(()=> {
        let data = []
        let Element = document.querySelectorAll('.product_pod');
        Element.forEach((elem)=>{
            data = [...data,{
                title:elem.childNodes[5].innerText,
                price:elem.childNodes[7].children[0].innerText
            }]
        })
        return data
    })
    browser.close()
    return result
};
const doing =async () => {
    let x = await scrape();
    console.log(x)
}
doing()

app.use(morgan(`dev`));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    }),
);

app.listen(port, () => console.log(`server is runing on port ${port}`));
