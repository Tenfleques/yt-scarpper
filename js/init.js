chrome.runtime.sendMessage({
    from: 'init',
    subject: 'showPageAction',
});

let links = document.getElementsByTagName("a")
let urls = []
for (var i = 0; i < links.length; ++i){
    l = links[i].href
    if (l.includes("/youtube/user") || l.includes("/youtube/channel")){
        urls.push(l)
    }
}
const grabContent = url => fetch(url)
    .then(res => res.text())
    .then(function(html){
        res = [];
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        let links = doc.getElementsByTagName("a");

        for (let i = 0; i < links.length; ++i){
            let is_yt_link = links[i].href.includes("youtube.com") 
            && !links[i].href.includes("socialblade")
            if (is_yt_link){
                let l = links[i].href;
                if (l.endsWith("/")){
                    l += "about";
                }else{
                    l += "/about";
                }

                res.push({
                    "id" : url,
                    "link"  : l, 
                    "email" : l
                });
            }
        }
        return res;
    }
);
Promise
    .all(urls.map(grabContent))
    .then((d) => {
        chrome.runtime.onMessage.addListener((msg, sender, response) =>{
            // First, validate the message's structure.
            if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
              response(d);
            }
        });
})

