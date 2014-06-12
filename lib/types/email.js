
module.exports.loadType = function (db) {

  function Email (path, options) {
    db.SchemaTypes.String.call(this, path, options);
    function validateEmail (val) {
      return /^[\+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(val);
    }
    this.validate(validateEmail, 'email is invalid');
  }
  Email.prototype.__proto__ = db.SchemaTypes.String.prototype;
  Email.prototype.cast = function (val) {
    return val.toLowerCase();
  };
  db.SchemaTypes.Email = Email;
  db.Types.Url = String;
};
