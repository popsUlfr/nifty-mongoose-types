var Url = require("url");

module.exports.loadType = function (db) {

  function Url (path, options) {
    db.SchemaTypes.String.call(this, path, options);
    function validateUrl (val) {
      var urlRegexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return urlRegexp.test(val);
    }
    this.validate(validateUrl, 'url is invalid');
  }
  Url.prototype.__proto__ = db.SchemaTypes.String.prototype;
  Url.prototype.cast = function (val) {
    return module.exports.normalizeUrl(val);
  };
  db.SchemaTypes.Url = Url
  db.Types.Url = String;
};

// See http://en.wikipedia.org/wiki/URL_normalization
module.exports.normalizeUrl = (function () {
  var reorderQuery = function (query) {
    var orderedKeys = [], name, i, len, key, querystr = [];
    for (name in query) {
      for (i = 0, len = orderedKeys.length; i < len; i++) {
        if (orderedKeys[i] >= name) break;
      }
      orderedKeys.splice(i, 0, name);
    }
    for (i = 0, len = orderedKeys.length; i < len; i++) {
      key = orderedKeys[i];
      querystr.push(key + "=" + query[key]);
    }
    return querystr.join("&");
  };

  var isEmpty = function (map) {
    for(var key in map) {
      if (map.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  return function (uri) {
    var parsedUrl = Url.parse(uri, true)
      , urlstr = ""
      , protocol = parsedUrl.protocol
      , hostname = parsedUrl.hostname
      , port = parsedUrl.port
      , pathname = parsedUrl.pathname
      , query = parsedUrl.query
      , hash = parsedUrl.hash;
    urlstr += (protocol ? protocol.toLowerCase() : '') + "//" + (hostname ? hostname.toLowerCase() : '') + ((port)?':'+parsedUrl.port:'') + // Convert scheme and host to lower case;
      (pathname ?
         pathname.replace(/\/\.{1,2}\//g, "/").replace(/\/{2,}/, "/") : // Remove dot-segments; Remove duplicate slashes
         "/" // Add trailing /
      );
    if (!isEmpty(query)) {
      urlstr += "?" + reorderQuery(query);
    }
    if (hash) {
      urlstr += hash;
    }
    return urlstr;
  };
})();
