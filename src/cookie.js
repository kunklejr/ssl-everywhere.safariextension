function Cookie(s, host) {
  this.parse(s, host);
}
Cookie.computeId = function(c) {
  return c.name + ";" + c.host + "/" + c.path;
};

Cookie.attributes = { host: 'domain', path: 'path', expires: 'expires', isHttpOnly: 'HttpOnly', isSecure: 'Secure' };
Cookie.prototype = {
  name: '',
  value: '',
  source: '',
  domain: '',
  host: '',
  rawHost: '',
  path: '',
  secure: false,
  httponly: false,
  session: true,
  expires: 0,
  id: '',
  
  toString: function() {
    var c = [this['name'] + "=" + this.value];
    var v;
    const aa = Cookie.attributes;
    for (var k in aa) {
      var p = aa[k];
      v = this[k];
      switch(typeof(v)) {
        case "string":
          if (v) c.push(p + "=" + v);
          break;
        case "boolean":
          if (v) c.push(p);
          break;
        case "number":
          if (!this.isSession) c.push(p + "=" + new Date(v * 1000).toUTCString());
          break;
      }
    }
    return c.join("; ");
  },
  
  parse: function(s, host) {
    var p;
    if (this.source) {
      // cleanup for recycle
      for (p in this) {
        if (typeof (p) != "function") delete this[p];
      }
    }
    this.source = s;
    this.host = host;
    
    var parts = s.split(/;\s*/);
    var nv = parts.shift().split("=");
    
    this.name = nv.shift() || '';
    this.value = nv.join('=') || '';
    
    var n, v;
    for (p in parts) {
      nv = p.split("=");
      switch (n = nv[0].toLowerCase()) {
        case 'expires':
          v = Math.round(Date.parse((nv[1] || '').replace(/\-/g, ' ')) / 1000);
        break;
        case 'domain':
        case 'path':
          v = nv[1] || '';
          break;
        case 'secure':
        case 'httponly':
          v = true;
          break;
        default:
          n = 'unknown'
      }
      this[n] = v;
    }
    if (!this.expires) {
      this.session = true;
      this.expires = Math.round(new Date() / 1000) + 31536000;  
    }
    if (this.domain) {
      if (!this.isDomain) this.domain = "." + this.domain;
      this.host = this.domain;
    }
    this.rawHost = this.host.replace(/^\./, '');
    
    this.id = Cookie.computeId(this);
  },
  
  belongsTo: function(host, path) {
    if (path && this.path && path.indexOf(this.path) != 0) return false;
    if (host == this.rawHost) return true;
    var d = this.domain;
    return d && (host == d || this.isDomain && host.slice(-d.length) == d);
  },
  
  isSecure: function() { return this.secure; },
  
  expiry: function() { return this.expires; },
  
  isSession: function() { return this.session; },
  
  isHttpOnly: function() { return this.httponly; },
  
  isDomain: function() { return this.domain && this.domain[0] == '.'; },
  
  policy: 0,
  
  status: 0
}