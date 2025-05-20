import puppeteer from "puppeteer";
import os from "node:os";
import { PuppeteerAgent } from "@midscene/web/puppeteer";
import "dotenv/config";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
Promise.resolve(
  (async () => {
    // const browser = await puppeteer.launch({
    //   headless: false, // 'true' means we can't see the browser window
    //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // });

    // /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9999 --remote-allow-origins=\* --user-data-dir=/Users/javayhu/chrome_dir
    // ws://127.0.0.1:9999/devtools/browser/fbb7b6b0-da31-4df9-9f51-708db7d2e575
    const browser = await puppeteer.connect({
      // TODO: test wechat browser
      browserURL: "http://127.0.0.1:62168",
      // browserWSEndpoint: "ws://127.0.0.1:62168/devtools/browser/35052380-ffb6-4037-9a30-a0ad49d68abd",
      
      // TODO: test local chrome browser
      // browserURL: "http://127.0.0.1:9999",
      // browserWSEndpoint: "ws://127.0.0.1:9999/devtools/browser/7121a92c-7c02-4eaa-9c30-f7029a47b0ac",
    });

    // TODO: ProtocolError: Protocol error (Target.createTarget): Not supported
    // const page = await browser.newPage();
    const pages = await browser.pages();
    console.log("pages: ", pages);
    // find the page with the url contains "wxde8ac0a21135c07d" 美团外卖小程序
    const page = pages.find((page) => page.url().includes("wxde8ac0a21135c07d"));
    console.log("美团外卖小程序Page: ", page);
    if (!page) {
      throw new Error("No page found with url contains wxde8ac0a21135c07d");
    }
    // const page = pages[0];
    // const page = pages[0];
    // console.log("page: ", page);
    // GPT-4o has a maximum image input size of 2000x768 or 768x2000, but got 1265x800. 
    // Please set your page to a smaller resolution. Otherwise, the result may be inaccurate.
    // TODO: TypeError: Cannot read properties of undefined (reading 'setViewport')
    // await page.setViewport({
    //   width: 1280,
    //   height: 800,
    //   deviceScaleFactor: os.platform() === "darwin" ? 2 : 1, // this is used to avoid flashing on UI Mode when doing screenshot on Mac
    // });

    const viewport = page.viewport();
    console.log("viewport: ", viewport);
    await page.setViewport({
      width: viewport?.width ?? 835,
      height: viewport?.height ?? 1565,
      deviceScaleFactor: os.platform() === "darwin" ? 2 : 1, // this is used to avoid flashing on UI Mode when doing screenshot on Mac
    });

    // TODO: TypeError: Cannot read properties of undefined (reading 'goto')
    // await page.goto("https://www.ebay.com");
    // await sleep(5000);

    const agent = new PuppeteerAgent(page);
    console.log("agent: ", agent);

    // 👀 run YAML with agent
    const { result } = await agent.runYaml(`
tasks:
  - name: search
    flow:
      - ai: 我需要订购外卖送到家，外卖的商品是任意奶茶饮品，高价优先，商品定制默认。如果商品价格不够起送费，订购两杯。
      - sleep: 3000
`);

    console.log(result);

    // await browser.close();
  })()
);
