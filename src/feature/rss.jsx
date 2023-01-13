import { Feed } from "feed";

const generateRSSFeed = (metadata, items) => {
    const selfURL = window.location.href;

    const feed = new Feed({
        title: `${metadata['name']} - @${metadata['handle']}`,
        description: metadata['description'],
        id: selfURL,
        link: selfURL,
        language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: metadata['headerPicture'],
        // favicon: "http://example.com/favicon.ico",
        // copyright: "All rights reserved 2013, John Doe",
        updated: new Date(), // optional, default = today
        generator: "easel", // optional, default = 'Feed for Node.js'
        // feedLinks: {
        //     json: "https://example.com/json",
        //     atom: "https://example.com/atom"
        // },
        author: {
            name: metadata['name'],
            email: "johndoe@example.com",
            link: selfURL
        }
    });

    items.forEach(item => {
        feed.addItem({
            title: item.item_name,
            // id: post.url,
            // link: post.url,
            description: item.data.content,
            content: item.data.content,
            author: [
                {
                    name: metadata['name'],
                    // email: "janedoe@example.com",
                    // link: "https://example.com/janedoe"
                }
            ],
            // contributor: [
            //     {
            //         name: "Shawn Kemp",
            //         email: "shawnkemp@example.com",
            //         link: "https://example.com/shawnkemp"
            //     },
            //     {
            //         name: "Reggie Miller",
            //         email: "reggiemiller@example.com",
            //         link: "https://example.com/reggiemiller"
            //     }
            // ],
            date: new Date(item.data.lastModified),
            // image: post.image
        });
    });

    return feed.rss2();
}

const parseRSSFeedContent = (xmlString, url) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "text/xml");
    console.log(url)

    const items = [];

    const title = xml.querySelector("title").textContent;

    for (let i = 0; i < xml.querySelectorAll("item").length; i++) {
        const item = xml.querySelectorAll("item")[i];
        const itemObj = {
            item_name: item.querySelector("title").textContent,
            source: url + "/content/feed/" + item.querySelector("title").textContent + ".md",
            author: title,
            data: {
                content: item.querySelector("description").textContent,
                lastModified: item.querySelector("pubDate").textContent
            }
        }
        items.push(itemObj)
        // items.push(url + "/content/feed/" + item.querySelector("title").textContent + ".md");
    }

    return items;
}


export { generateRSSFeed, parseRSSFeedContent };