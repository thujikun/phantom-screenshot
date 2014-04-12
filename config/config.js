module.exports = {
    flags: [
        // proxy setting
        // "--proxy=PROXYSERVER:PORT",

        // ignore ssl error
        // "--ignore-ssl-errors=yes"
    ],
    viewports: [
        // for dummy
        {width: 100, height: 100},
        // for iPhone
        {width: 320, height: 518, userAgent: "iphone"},
        // for Android
        {width: 360, height: 640, userAgent: "android4"},
        // for desktop
        {width: 1200, height: 800, userAgent: "chrome"},
    ],
    pages: [
        // Google
        {
            title: "google",
            url: "http://www.google.com",
        },
        // Youtube
        {
            title: "youtube",
            url: "http://www.youtube.com",
        },
        // Yahoo
        {
            title: "yahoo",
            url: "http://www.yahoo.com",
        },
        // Tech crunch
        {
            title: "tech-crunch",
            url: "http://techcrunch.com",
        },
        // Hacker news
        {
            title: "hacker-news",
            url: "https://news.ycombinator.com/",
        },
        // Pinterst
        {
            title: "pinterest",
            url: "https://www.pinterest.com/",
        },
    ],
};