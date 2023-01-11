import * as linkify from 'linkifyjs';
import linkifyHtml from "linkify-html";

function convertYouTubeLinksToEmbeds(text) {
    const youtubeRegex = /https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g;
    const youtubeEmbed = '<iframe width="560" height="315" src="https://www.youtube.com/embed/$2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

    return text.replace(youtubeRegex, youtubeEmbed);
}

const parseContent = (raw_content) => {
    let _content = raw_content;
    _content = convertYouTubeLinksToEmbeds(_content);

    const options = {
        /* … */
    };

    return linkifyHtml(_content, options);
}

export { parseContent };