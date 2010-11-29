function handleLoadStartEvent(event) {
  document.removeEventListener("load", handleLoadStartEvent, true);
  safari.self.tab.dispatchMessage("http.load", { location: document.location, cookies: document.cookie });
}

function fixReferences() {
  var hostname = document.location.hostname.replace(/\./g, "\\.");
  
  var linkSelector = "a[href^=http\\:\\/\\/" + hostname + "]";
  var insecureLinks = document.querySelectorAll(linkSelector);
  for (var i = 0; i < insecureLinks.length; i++) {
    insecureLinks[i].href = insecureLinks[i].href.replace(/^http:/, "https:");
  }

  var formSelector = "form[action^=http\\:\\/\\/" + hostname + "]";
  var insecureForms = document.querySelectorAll(formSelector);
  for (var i = 0; i < insecureForms.length; i++) {
    insecureForms[i].action = insecureForms[i].action.replace(/^http:/, "https:");
  }
}

function handleMessageEvent(event) {
  if (event.name == "https.redirect") {
    document.location = event.message;
  }
}

if (window.top == window // prevents SSL Everywhere from running in iframes too
    && document.location.protocol == "http:") { 
  document.addEventListener("load", handleLoadStartEvent, true);
  safari.self.addEventListener("message", handleMessageEvent, false);  
}
