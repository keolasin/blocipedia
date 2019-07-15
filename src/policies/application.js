module.exports = class ApplicationPolicy {

  // initialize policy instance with the currently auth user and objects to auth
  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

  // helper method to check that a record is present and the user owns it
  _isOwner() {
    return this.record && (this.record.userId === this.user.id);
  }

  // checks that a user is present and user is an admin
  _isAdmin() {
    return this.user && this.user.role === "admin";
  }

  // checks that a user is present and a standard user
  _isStandard(){
    return this.user && this.user.role === "standard";
  }

  // checks that a user is present and a premium user
  _isPremium(){
    return this.user && this.user.role === "premium";
  }

  // checks that a user is present
  new() {
    return this.user != null;
  }

  // delegates to new
  create() {
    return this.new();
  }

  // always authorizes the action
  show() {
    return true;
  }

  // checks that the user is allowed to create a new record, a record is present, and either the user owns the record is the user is an admin
  edit() {
    return this.user != null &&
      this.record && (this._isOwner() || this._isAdmin());
  }

  update() {
    return this.edit();
  }

  // delegates to update
  destroy() {
    return this.update();
  }
}
