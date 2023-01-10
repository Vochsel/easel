function loadFile(path) {
    return new Promise((resolve, reject) => {
        fetch(path, {
            cache: "no-store",
            headers: {
                'Cache-Control': 'no-cache'
            }
        }).then(async data => {
            if (data.ok) {
                const content = await data.text();
                let lastModified = data.headers.get('Last-Modified');
                if(!lastModified) lastModified = "1966-11-06";

                resolve({
                    lastModified,
                    content: content
                });
            }
            else
                reject("No file")
        })

    })
}

function loadManifest(path) {
    return loadFile(path + `/manifest.txt?cache_hack=${Date.now()}`).then(data => {
        return data.content.split('\n').filter(n => n)
    });
}

async function loadEaselJSON(dir) {
    return fetch(dir + "easel.json").then(data => data.json()).catch(x => null);
}


async function loadContentDynamically(dir) {
    var container = createOrGetElement("container");
    var missedIndex = false;
    var counter = 1;

    while (!missedIndex) {
        const data = await loadFile(`${dir}/${counter}.md`)
            .catch(err => missedIndex = true);

        if (!missedIndex) {
            var el = renderItem(data, counter, {
                source: `${counter}.md`
            })
            container.prepend(el);
        }
        counter += 1;
    }
    console.log("Finished loading content");
}

async function loadItem(dir, file_name) {
    return new Promise(async resolve => {
        const item_name = file_name.split('.')[0];
        const data = await loadFile(`${dir}/${file_name}`)

        resolve({
            data,
            item_name,
            source: file_name
        });
    })
}

async function loadContentFromManifest(dir, files) {
    console.log(`Loaded manifest.txt and found ${files.length} items`)
    let output = [];
    // for(let i = files.length - 1; i >= 0; --i) {
    for (let i = 0; i < files.length; i++) {
        const item_name = files[i].split('.')[0];
        const data = await loadFile(`${dir}/${files[i]}`)
        // const el = renderItem(data, item_name, {
        //     source: files[i]
        // })
        output.push({
            data,
            item_name,
            source: files[i]
        })
        // container.append(el);
    }
    return output;
}

async function loadContent(dir) {
    return loadContentFromManifest(dir).catch(x => {
        console.log(x);
        console.log("No manifest.txt found, doing sequential lookup")
        // No manifest found
        return loadContentDynamically(dir);
    })
}

function fetchContent(dir) {
    return new Promise(async resolve => {
        const items = await loadContent(location.pathname + "content/feed");
        resolve(items);
    });
}

export { loadFile, loadManifest, loadContentFromManifest, fetchContent, loadItem }