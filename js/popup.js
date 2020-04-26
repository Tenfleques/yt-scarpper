function extractEmails(text){
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild; 
}

function getEmail(obj){
  let html = "<h6 class='col-12' ><a target='_blank' href='"+obj.link+"'>"+obj.email+"</a></h6>";
  // var xhr = new XMLHttpRequest();
  // xhr.open("GET", obj, true);
  // xhr.onreadystatechange = function() {
  //   if (xhr.readyState == 4) {
        

  //       let emails = extractEmails(xhr.responseText);

  //       if (emails){
  //         html = "<h6 class='col-12' ><a href='"+obj.link+"'>"+emails.join(" ")+"</a></h6>"
  //       }

        
  //   }
  // }
  // xhr.send();

  let el = createElementFromHTML(html);
  document.getElementById("all_links").appendChild(el)
}

const setDOMInfo = info => {
  if (info){
    for (var i = 0; i < info.length; ++i){
      for (var j = 0; j < info[i].length; ++j){
        getEmail(info[i][j]);
      }
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'DOMInfo'},
        setDOMInfo);
  });
});