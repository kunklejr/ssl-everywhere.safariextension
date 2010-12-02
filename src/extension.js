var rulesets = [];

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

function checkForRedirectUrl(url) {
  var hostname = url.match(/https?\:\/\/([^\/$\?#]+)/)[1],
      ruleset = findRuleSet(hostname);
      
  if (ruleset && ruleset.enabled && ruleset.isMatchRuleMatching(url) && !ruleset.isUrlExcluded(url)) {
    ruleset.updateSecureCookies();
    return ruleset.getRedirectUrl(url);
  }
}

function handleMessage(event) {
  if (event.name == "canLoad") {
    event.message = checkForRedirectUrl(event.message);
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
