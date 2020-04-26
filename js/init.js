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

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild; 
}
  
const setDOMInfo = info => {
    if (info){
        var el = document.createElement('div');
        el.className = "links_footer";
        el.appendChild(createElementFromHTML("<h6 class='col-12'> "+info.length+" links found</h6>"));

        console.log(el);
        for (var i = 0; i < info.length; ++i){
            for (var j = 0; j < info[i].length; ++j){
                let html = "<h6 class='col-6 m-3' ><a target='_blank' href='"+info[i][j].link+"'>"+info[i][j].email+"</a></h6>";
                let sub_el = createElementFromHTML(html);
                el.appendChild(sub_el)
            }
        }
        document.body.appendChild(el)
    }
};


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
        setDOMInfo(d);
        chrome.runtime.onMessage.addListener((msg, sender, response) =>{
            if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
              response(d);
            }
        });
})
  


