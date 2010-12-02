if (document.location.protocol == "http:") {
  var httpLoad = document.createEvent("Event");
  httpLoad.initEvent("load", true, true)
  var redirectTo = safari.self.tab.canLoad(httpLoad, document.location.href);
  if (redirectTo) {
    document.location = redirectTo;
  }
}
