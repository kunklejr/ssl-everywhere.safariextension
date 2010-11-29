function RuleSet(config) {
  this.name = config.name;
  this.enabled = config.enabled;
  this.matchRule = config.match_rule;
  this.targets = config.targets || [];
  this.exclusions = config.exlusions || [];
  this.secureCookies = config.secure_cookies || [];
  this.rules = config.rules || [];
  
  this._compileTargets(); // We know target regular expressions will always be needed
}

RuleSet.prototype = {
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
  
  isUrlExcluded: function(url) {
    this._compileExclusions();
    for (var i = 0; i < this.exclusionPatterns.length; i++) {
      if (this.exclusionPatterns[i].test(url)) {
        return true;
      }
    }
    return false;
  },
  
  updateSecureCookies: function(cookie) {
    this._compileSecureCookies();
  },
  
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
        this.exclusionPatterns.push(new RegExp(this.exlusions[i]));
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