/**
 * The RuleSet object encompases the logic from HTTP Everywhere that was able 
 * to be ported to the SSL Everywhere extension for Safari. Much of the 
 * protection offered by HTTP Everywhere cannot be replicated in a Safari
 * extension due to its limited API.
 */
function RuleSet(config) {
  this.name = config.name;
  this.enabled = config.enabled;
  this.matchRule = config.match_rule;
  this.targets = config.targets || [];
  this.exclusions = config.exclusions || [];
  this.secureCookies = config.secure_cookies || [];
  this.rules = config.rules || [];
  
  this._compileTargets(); // We know target regular expressions will always be needed
}

RuleSet.prototype = {
  
  /**
   * Determine if this RuleSet contains rules for handling the given host.
   * @param {String} host the host name this RuleSet might handle
   * @return true if this RuleSet handles the given host, false otherwise
   */
  isHandlerForHost: function(host) {
    for (var i = 0; i < this.targetPatterns.length; i++) {
      if (this.targetPatterns[i].test(host)) {
        return true;
      }
    }
    return false;
  },
  
  isMatchRuleMatching: function(url) {
    this._compileMatchRule();
    if (!this.matchRule) {
      return true;
    }
    return this.matchRulePattern.test(url);
  },
  
  /**
   * Determine if the given URL should be excluded from processing by
   * this RuleSet even though a host name rule matches.
   * @param {String} url a URL that might need to be excluded
   * @return true if this RuleSet should exclude the URL from processing, false otherwise
   */
  isUrlExcluded: function(url) {
    this._compileExclusions();
    for (var i = 0; i < this.exclusionPatterns.length; i++) {
      if (this.exclusionPatterns[i].test(url)) {
        return true;
      }
    }
    return false;
  },
  
  /**
   * This method is intended to secure any cookies specified as secure_cookies.
   * However, the best we can do is overwrite all existing cookies. Since we can't read
   * paths or expiration dates, we can't correctly secure the cookies. In general,
   * the best we can do is secure every cookie as a session cookie, which means 
   * that all cookies for the host will be removed when the browser is closed. 
   * Is that a reasonable thing to do?
   */
  updateSecureCookies: function(cookie) {
    this._compileSecureCookies();
  },
  
  /**
   * Get the SSL-secured version of the given URL.
   * @param {String} url the http: URL to be potentially rewritten as an https: URL
   * @return the https: rewritten String, or null if there's no https: version of the URL available
   */
  getRedirectUrl: function(url) {
    this._compileRules();
    for (var i = 0; i < this.rulePatterns.length; i++) {
      if (this.rulePatterns[i].from.test(url)) {
        return url.replace(this.rulePatterns[i].from, this.rulePatterns[i].to);
      }
    }
    return null;
  },
  
  _compileMatchRule: function() {
    if (this.matchRule && !this.matchRulePattern) {
      this.matchRulePattern = new RegExp(this.matchRule);
    }
  },
  
  _compileTargets: function() {
    if (!this.targetPatterns) {
      this.targetPatterns = [];
      for (var i = 0; i < this.targets.length; i++) {
        var targetPattern = this.targets[i].replace(/\./g, "\\.").replace("*", ".*")
        this.targetPatterns.push(new RegExp(targetPattern));
      }
    }
  },
  
  _compileExclusions: function() {
    if (!this.exclusionPatterns) {
      this.exclusionPatterns = [];
      for (var i = 0; i < this.exclusions.length; i++) {
        this.exclusionPatterns.push(new RegExp(this.exclusions[i]));
      }
    }
  },
  
  _compileSecureCookies: function() {
    if (!this.secureCookiePatterns) {
      this.secureCookiePatterns = [];
      for (var i = 0; i < this.secureCookies.length; i++) {
        this.secureCookiePatterns.push({host: new RegExp(this.secureCookies[i].host), to: this.secureCookies[i].name});
      }
    }
  },
  
  _compileRules: function() {
    if (!this.rulePatterns) {
      this.rulePatterns = [];
      for (var i = 0; i < this.rules.length; i++) {
        this.rulePatterns.push({from: new RegExp(this.rules[i].from), to: this.rules[i].to});
      }
    }
  }
};