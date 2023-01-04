/* == Utilities == */

function createOrGetElement(id) {

    var element = document.getElementById(id);

    if (!element) {
        element = document.createElement("div");
        element.id = id;
        document.body.appendChild(element);
    }

    return element;
}

function elementExists(id) {
    return document.getElementById(id) !== null;
}

// TODO: Create this converter only once?
function markdownToHTML(markdown) {
    var converter = new showdown.Converter();
    return converter.makeHtml(markdown);
}

// Loaders

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

                resolve({
                    lastModified: data.headers.get('Last-Modified'),
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

/* == Auth == */

function isLoggedIn() {
    var _private_key = getPrivateKey();
    if (!_private_key) return false;
    return checkLogin(_private_key);
}

function storePrivateKey(key) {
    localStorage.setItem('privateKey', key);
}

function getPrivateKey() {
    return localStorage.getItem("privateKey");
}

function checkLogin(private_key) {
    var crypt = new JSEncrypt();
    crypt.setPrivateKey(private_key);
    const pk = crypt.getPublicKey().replaceAll('\n', '');
    return pk === metadata.publicKey
}

function generateKeys() {
    var crypt = new JSEncrypt({ default_key_size: 1024 });
    const pv = crypt.getPrivateKey().replaceAll('\n', '');
    const pb = crypt.getPublicKey().replaceAll('\n', '');

    console.log(pv)
    console.log(pb)
}

/* == Rendering == */

// Basics

function renderTextArea(id) {
    var el = document.createElement('textarea');
    el.id = id;
    el.name = id;
    el.addEventListener('keydown', (e) => {
        if (e.key === "Enter" && e.shiftKey) {
            console.log("Post shortcut");
            // Submit shortcut
            document.getElementById("post").click();
        }
    })
    return el;
}


function renderButton(text, name, onClick) {
    var el = document.createElement('input');
    el.type = "submit";
    el.name = name;
    el.id = name;
    el.value = text;
    el.addEventListener('click', onClick);
    return el;
}

// Components

function renderEaselFooter() {
    var el = document.createElement("div");
    el.id = "footer";
    el.innerHTML = "Created on <a target='_blank' href='https://github.com/Vochsel/easel'>Easel</a>"
    document.body.appendChild(el)
}

function renderProfileHeader(metadata) {

    var profile = createOrGetElement("profile");

    profile.innerHTML = `
    <div id='profileHeader'>
        <img id='headerProfile' class='profilePicture' src='${metadata.profilePicture}' width='75' height='75'/>
        <img id='headerPicture' src='${metadata.headerPicture}' />
    </div>
    <span id='name'>${metadata.name}</span>
    <span id='handle'>@${metadata.handle}</span>
    <div id='description'>${metadata.description}</div>
    `

    document.body.prepend(profile);
}

function renderNav() {
    var nav_el = document.createElement("div");

    nav_el.id = "nav";

    if (!isLoggedIn()) {
        nav_el.appendChild(renderButton("Login", "login", () => {
            const private_key = prompt("Enter private key (Saved locally)");

            try {

                if (checkLogin(private_key)) {
                    storePrivateKey(private_key);
                    location.reload();
                    return;
                }
            } catch (error) {
                alert("Incorrect password");

            }
        }));
    } else {
        nav_el.appendChild(renderButton("Logout", "logout", () => {
            localStorage.clear();
            location.reload();
        }));
    }

    var form_el = document.createElement("form");
    form_el.method = "POST";

    form_el.appendChild(renderButton("Update RSS", "publish_rss", () => {
    }));

    form_el.appendChild(renderButton("Update easel.php", "update_easel", () => {
    }));

    let post_text_area = renderTextArea("new_post");
    form_el.appendChild(post_text_area);

    form_el.appendChild(renderButton("Post (Shift + Enter)", "post", () => {
        console.log(post_text_area.value);
    }));

    if (isLoggedIn())
        nav_el.appendChild(form_el);

    document.body.prepend(nav_el);
    return nav_el;
}

// Content

function renderItem(data, counter, opts = {}) {
    // console.log(data)
    var d = new Date(data.lastModified);
    var df = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) //weekday: 'long',

    // Item buttons
    var editButton = document.createElement("input");
    editButton.type = "button";
    editButton.value = "Edit";


    // -- Content metadata
    var metadataContainer = document.createElement("div");
    metadataContainer.className = "metadata";
    metadataContainer.innerHTML = `#<b>${counter}</b> - ${df} `;
    if(isLoggedIn())
        metadataContainer.append(editButton)


    // -- Content rendering
    var contentContainer = document.createElement("div");
    contentContainer.className = "content";

    var convertedContent = markdownToHTML(data.content);

    var contentView = document.createElement("div");
    contentView.innerHTML = convertedContent;

    var contentEdit = renderTextArea(`edit-${counter}`);
    contentEdit.value = data.content;
    contentEdit.style.width = "100%";
    contentEdit.style.height = 100;

    let isEditing = false;
    contentContainer.append(contentView);

    editButton.addEventListener("click", () => {
        // alert("CKICk")

        isEditing = !isEditing;
        console.log(isEditing);
        contentContainer.innerHTML = "";
        if (isEditing) {
            contentContainer.append(contentEdit);
            editButton.value = "Save";
        } else {
            // Save changes
            // We dynamically create a form here because _POST is taken on the same page...
            // so can't POST elsewhere, have to trigger a refresh on page...
            // Not my finest work, but its in the name of minimal footprint
            contentContainer.append(contentView);
            editButton.value = "Edit";

            var form = document.createElement("form");
            form.method = "POST";
            contentEdit.name = "edit_post";
            form.appendChild(contentEdit);

            var edit_name = document.createElement("input");
            edit_name.type = "text";
            edit_name.name = "source";
            edit_name.value = opts['source'];
            form.appendChild(edit_name);

            document.body.appendChild(form);
            form.submit();
        }

        console.log(contentContainer)
    })

    var el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `<hr>`
    el.append(metadataContainer);
    el.append(contentContainer);
    return el;

}

/* == Feed Loaders == */

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


async function loadContentFromManifest(dir) {
    var container = createOrGetElement("container");
    const files = await loadManifest(dir);
    console.log(`Loaded manifest.txt and found ${files.length} items`)
    // for(let i = files.length - 1; i >= 0; --i) {
    for (let i = 0; i < files.length; i++) {
        const item_name = files[i].split('.')[0];
        const data = await loadFile(`${dir}/${files[i]}`)
        const el = renderItem(data, item_name, {
            source: files[i]
        })
        container.append(el);
    }
}

async function loadContent(dir) {
    loadContentFromManifest(dir).catch(x => {
        console.log(x);
        console.log("No manifest.txt found, doing sequential lookup")
        // No manifest found
        loadContentDynamically(dir);
    })
}