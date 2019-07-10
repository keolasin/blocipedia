const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  create() {
    return this.new();
  }

  edit() {
    return this.user != null;
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this._isOwner();
  }
}
