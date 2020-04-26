var xhr = new XMLHttpRequest();
xhr.open("GET", "https://youtube.com", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
      console.log(xhr.responseText);
  }
}
xhr.send();