const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  create() {
    return this.new();
  }

  edit() {
    return this._isOwner();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}
