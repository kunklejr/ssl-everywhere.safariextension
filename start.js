if (document.location.protocol == "http:") {
  var httpLoad = document.createEvent("Event");
  httpLoad.initEvent("canLoad", true, true)
  var redirectTo = safari.self.tab.canLoad(httpLoad, { location: document.location, cookies: document.cookie });
  if (redirectTo) {
    document.location = redirectTo;
  }
}
