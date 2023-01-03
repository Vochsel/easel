# Easel

Super simple blog/message/feed framework.

Host it yourself. Decentralize to your hearts content. Add to it. Learn from it. Go nuts.

Check out mine! [@Vochsel](http://vochsel.com/blog/)

## Instructions
### Overview

It's as simple as could possibly be:

1. Host an this [index.html](/demo/blog/index.html) file on a web site somewhere.
2. Add content in sequentially named files in `content/feed/*` next to `index.html`.
3. Get started by making a file named `1.md` and go for gold!

The most basic setup looks like this
```
content/feed/1.md
index.html
```

Your `index.html` literally only needs this line `<script src="https://cdn.jsdelivr.net/gh/vochsel/easel/src/easel.js"></script>`

### Creating content
Use markdown for styling, embed whatever you want, it's your site.

### Customizing your Profile
Easel looks for a file called `easel.json` next to `index.html`. There you can add any profile information you want.

```
{
    "handle": "",
    "name": "",
    "profilePicture": "",
    "headerPicture": "",
    "location": "",
    "description": ""
}
```

### Advanced (PHP)
We need to bundle the easel.php file alongside index.php (Maybe we can update this in place?)

## Behind the scenes...
It's literally just a website....

### Vague Roadmap
(No gaurantees, but feel free to join the conversation or contribute!)

* Pagination? Definitely lazy load
* Add multiple sub routes of content feeds with automatic navigation
* Improve styling
* Add minified version
* Link profile easel.json to twitter/mastodon etc
* Link people together
* Follow people?
* A feed of other peoples stuff?
* Automatic RSS feed generation? (No idea how yet)