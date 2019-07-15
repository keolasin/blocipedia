const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  new() {
    return this._isMember() || this._isPremium() || this._isAdmin();
  }

  create() {
    this.new()
  }

  edit() {
    return (this._isOwner() && (this._isPremium() || this._isStandard() || this._isAdmin()));
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this._isOwner();
  }
}
