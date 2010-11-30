var rulesets = [];

function dispatchMessage(message, args) {
  safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(message, args);
}

function register(ruleset) {
  if (safari.extension.settings["rule." + ruleset.name]) {
    ruleset.enabled = true;
  } else {
    ruleset.enabled = false;
  }
  rulesets.push(ruleset);
}

function findRuleSet(hostname) {
  for (var i = 0; i < rulesets.length; i++) {
    if (rulesets[i].enabled && rulesets[i].isHandlerForHost(hostname)) {
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
      
  if (ruleset && ruleset.enabled && ruleset.isMatchRuleMatching(url) && !ruleset.isUrlExcluded(url)) {
    ruleset.updateSecureCookies();
    return ruleset.getRedirectUrl(url);
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
  if (event.name == "canLoad") {
    var redirectUrl = handleHttpLoad(event);
    event.message = redirectUrl;
  } else if (event.name == "http.url") {
    handleHttpUrl(event.message);
  }
}

function handleSettingsChanged(event) {
  if (event.key.match(/^rule\./)) {
    var rulesetName = event.key.slice(5);
    for (var i = 0; i < rulesets.length; i++) {
      var ruleset = rulesets[i];
      if (ruleset.name == rulesetName) {
        ruleset.enabled = event.newValue;
        return;
      }
    }
  }
}

safari.application.addEventListener("message", handleMessage, false);
safari.extension.settings.addEventListener("change", handleSettingsChanged, false);
