import { fetchContent, loadContentFromManifest, loadManifest } from "../loaders";
import { generateRSSFeed } from "./rss";

const postItem = async (value) => {
    let formData = new FormData();
    formData.append('new_post', value);

    return fetch("api.php", {
        method: 'POST',
        body: formData
    }).then(x => x.text());
}

const editItem = async (new_value, path) => {

    let formData = new FormData();
    formData.append('edit_post', new_value);
    formData.append('source', path);

    return fetch("api.php", {
        method: 'POST',
        body: formData
    }).then(x => x.text());
}

const deleteItem = async(path) => {
    
    let formData = new FormData();
    formData.append('delete_post', path);

    return fetch("api.php", {
        method: 'POST',
        body: formData
    }).then(x => x.text());
}

const uploadItem = async (file) => {
    let formData = new FormData();
    formData.append('has_upload', true);
    formData.append('upload_media', file)

    return fetch("api.php", {
        method: 'POST',
        body: formData
    }).then(x => x.text());
}

const publishRSS = async () => {
    // TODO: When merged, use new feed context
    const metadata = await fetch('./easel.json').then(x => x.json());
    const manifest = await loadManifest(location.pathname + "content/feed");
    const items = await loadContentFromManifest("./content/feed", manifest);
    let rss_file = generateRSSFeed(metadata, items);

    let formData = new FormData();
    formData.append('write_file', true);
    formData.append('path', "./rss.xml");
    formData.append('contents', rss_file);

    return fetch("api.php", {
        method: 'POST',
        body: formData
    }).then(x => x.text());
}

const syncServer = async (version = "latest") => {

    let formData = new FormData();
    formData.append('update_easel', version);

    return fetch("api.php", {
        method: 'POST',
        body: formData
    }).then(x => x.text());
}

export { postItem, editItem, uploadItem, publishRSS, syncServer, deleteItem };