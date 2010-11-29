var rulesets = [];

function dispatchMessage(message, args) {
  safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(message, args);
}

function register(ruleset) {
  rulesets.push(ruleset);
}

function findRuleSet(hostname) {
  for (var i = 0; i < rulesets.length; i++) {
    if (!rulesets[i].disabled && rulesets[i].isHandlerForHost(hostname)) {
      return rulesets[i];
    }
  }
}

function handleHttpLoad(event) {
  var args = event.message,
      hostname = args.location.hostname,
      url = args.location.href,
      cookies = args.cookies,
      ruleset = findRuleSet(hostname);
      
  if (ruleset && !ruleset.disabled && ruleset.isMatchRuleMatching(url) && !ruleset.isUrlExcluded(url)) {
    ruleset.updateSecureCookies();
    var redirectUrl = ruleset.getRedirectUrl(url);
    if (redirectUrl) {
      dispatchMessage("https.redirect", redirectUrl);
    }
  }
}

function handleHttpUrl(args) {
  var match = args.url.match(/https?\:\/\/([^\/$\?#]+)/)
  if (match && match.length > 1) {
    var hostname = match[1];
    var ruleset = findRuleSet(hostname);
    if (ruleset) {
      var redirectUrl = ruleset.getRedirectUrl(args.url);
      if (redirectUrl) {
        dispatchMessage("https.rewrite", { type: args.type, from: args.url, to: redirectUrl });
      }
    }
  }
}

function handleMessage(event) {
  if (event.name == "http.load") {
    handleHttpLoad(event);
  } else if (event.name == "http.url") {
    handleHttpUrl(event.message);
  }
}

safari.application.addEventListener("message", handleMessage, false);
