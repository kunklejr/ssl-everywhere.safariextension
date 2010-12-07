var rulesets = [];

/**
 * Called by all JavaScript rule sets as they are loaded.
 * @param {RuleSet} ruleset one of many RuleSet objects
 */
function register(ruleset) {
  if (safari.extension.settings["rule." + ruleset.name]) {
    ruleset.enabled = true;
  } else {
    ruleset.enabled = false;
  }
  rulesets.push(ruleset);
}

/**
 * Find the RuleSet applicable for the given host.
 * @return the RuleSet that handles the given host, or undefined
 */
function findRuleSet(host) {
  for (var i = 0; i < rulesets.length; i++) {
    if (rulesets[i].enabled && rulesets[i].isHandlerForHost(host)) {
      return rulesets[i];
    }
  }
}

/**
 * Find an SSL-secured version of the given URL.
 * @param {String} url a possibly insecure URL
 * @return an SSL-secured version of the URL, or undefined
 */
function checkForRedirectUrl(url) {
  var host = url.match(/https?\:\/\/([^\/$\?#]+)/)[1],
      ruleset = findRuleSet(host);
      
  if (ruleset && ruleset.enabled && ruleset.isMatchRuleMatching(url) && !ruleset.isUrlExcluded(url)) {
    return ruleset.getRedirectUrl(url);
  }
}

/**
 * Distribution point for messages send from start or end scripts.
 * @param {SafariExtensionMessageEvent} event
 */
function handleMessage(event) {
  if (event.name == "canLoad") {
    event.message = checkForRedirectUrl(event.message);
  }
}

/**
 * This event is called when any of the extension settings are changed
 * through the Safari extensions preference pane. The only thing of 
 * interest at this time is the enabling/disabling of rules.
 * @param {SafariExtensionSettingsChangeEvent} event event detailing the settings change
 */
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
