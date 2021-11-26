class DB {
  constructor() {
    this._db = new Map();
  }

  add({ id, name, age, hobbies }) {
    this._db.set(id, { id, name, age, hobbies });
    return { id, name, age, hobbies };
  }

  getAll(id) {
    return [...this._db.values()];
  }

  get(id) {
    if (this._db.has(id)) {
      return this._db.get(id);
    }
    return false;
  }

  update(id, obj) {
    if (this._db.has(id)) {
      if (obj.id) obj.delete(id);
      this._db.set(id, { id, ...obj });
      return true;
    }
    return false;
  }
  delete(id) {
    return this._db.delete(id);
  }
}

module.exports = DB;
