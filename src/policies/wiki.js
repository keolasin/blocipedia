const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  create() {
    return this.new();
  }

  edit() {
    return (this.user != null && (!this.record.private) || this._isOwner());
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this._isOwner();
  }
}
