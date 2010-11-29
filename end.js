function fixElementReferences(elements) {
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].href) {
      safari.self.tab.dispatchMessage("http.url", { type: "link", url: elements[i].href });
    } else if (elements[i].action) {
      safari.self.tab.dispatchMessage("http.url", { type: "form", url: elements[i].action });
    }
  }
}

function updateUrl(url) {
  if (url.type == "link") {
    var linkSelector = "a[href=" + url.from.replace(/([:\/\.\?\+=%&@])/g, "\\$1") + "]";
    var links = document.querySelectorAll(linkSelector);
    for (var i = 0; i < links.length; i++) {
      links[i].href = url.to;
    }
  } else if (url.type == "form") {
    var formSelector = "form[action=" + url.from.replace(/([:\/\.\?\+=%&@])/g, "\\$1") + "]";
    var forms = document.querySelectorAll(formSelector);
    for (var i = 0; i < forms.length; i++) {
      forms[i].action = url.to;
    }
  }
}

function handleMessageEvent(event) {
  if (event.name == "https.rewrite") {
    updateUrl(event.message);
  }
}

function handleDomNodeInsertionEvent(event) {
  fixElementReferences(event.target.querySelectorAll("a[href^=http\\:]"));
  fixElementReferences(event.target.querySelectorAll("form[action^=http\\:]"));
}

document.addEventListener("DOMNodeInserted", handleDomNodeInsertionEvent, true);
safari.self.addEventListener("message", handleMessageEvent, false);

fixElementReferences(document.querySelectorAll("a[href^=http\\:]")); // links
fixElementReferences(document.querySelectorAll("form[action^=http\\:]")); // forms
