function handleLoadStartEvent(event) {
  document.removeEventListener("load", handleLoadStartEvent, true);
  safari.self.tab.dispatchMessage("http.load", { location: document.location, cookies: document.cookie });
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
