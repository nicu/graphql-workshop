const uuid = require('./uuid');

const debug = (...args) => null; //Collection.DEBUG_ENABLED && console.log.apply(console, args);

const isMatch = criteria => model =>
  Object.keys(criteria).every(key => criteria[key] === model[key]);

const isNotMatch = criteria => model =>
  Object.keys(criteria).some(key => criteria[key] !== model[key]);

class Model {
  constructor(attrs) {
    this.id = uuid();
    for (let key in attrs) {
      this[key] = attrs[key];
    }
  }
}

class Collection {
  constructor(initialData = [], name) {
    this.associations = {};
    this.name = name;
    this.items = initialData.map(this.proxyAssociations.bind(this));
  }

  create(item) {
    const model = this.proxyAssociations(new Model(item));
    this.items.push(model);

    debug(`${this.name}::CREATED ${model.id}`);

    return model;
  }

  findAll(ids) {
    if (ids) {
      debug(`${this.name}::FIND ALL (${ids})`);
      return this.items.filter(item => ids.indexOf(item.id) !== -1);
    }

    debug(`${this.name}::FIND ALL`);
    return this.items.slice();
  }

  find(criteria) {
    if (this.name === 'Users') {
      debugger;
    }
    debug(`${this.name}::FIND ALL WHERE`, criteria);
    if (Array.isArray(criteria)) {
      return criteria
        .map(condition => this.items.filter(isMatch(criteria)))
        .flat();
    }
    return this.items.filter(isMatch(criteria));
  }

  // TODO add tests
  findOne(criteria) {
    debug(`${this.name}::FIND ONE WHERE`, criteria);
    const [item] = this.items.filter(isMatch(criteria));
    return item;
  }

  update(criteria, item) {
    debug(`${this.name}::UPDATE WHERE`, criteria);
    const filtered = this.find(criteria);
    if (!filtered.length) {
      throw new Error(
        `[${this.name}] Item ${JSON.stringify(criteria)} not found!`
      );
    }

    const updated = filtered.map(elem => Object.assign(elem, item));
    return updated;
  }

  remove(criteria) {
    console.log('Removing', criteria, 'from', this.items);
    debug(`${this.name}::REMOVE WHERE`, criteria);
    const removed = this.items.filter(isMatch(criteria));
    if (!removed.length) {
      throw new Error(
        `[${this.name}] Item ${JSON.stringify(criteria)} not found!`
      );
    }

    this.items = this.items.filter(isNotMatch(criteria));
    return removed;
  }

  proxyAssociations(item) {
    return new Proxy(new Model(item), {
      get: this.proxyGetter.bind(this)
    });
  }

  // when trying to access a property
  // first try to return the association's value defined for that property
  // otherwise return the property's value
  // Example:
  //   User.hasMany(Posts);
  //   const user = User.find({id: 1});
  //   user.posts; // => Posts.find({userId: user.id})
  proxyGetter(obj, prop) {
    return this.associations[prop]
      ? this.associations[prop](obj)
      : Reflect.get(obj, prop);
  }

  belongsTo(collection, attrName, foreignKey) {
    const key = foreignKey || attrName + 'Id';
    this.associations[attrName] = obj => {
      const [item] = collection.find({ id: obj[key] });
      return item;
    };
  }

  hasMany(collection, attrName, foreignKey) {
    this.associations[attrName] = obj =>
      collection.find({ [foreignKey]: obj.id });
  }

  hasAndBelongsToMany(collection, attrName, foreignKey, otherKey, through) {
    this.associations[attrName] = obj => {
      const rows = through.find({ [foreignKey]: obj.id });
      return rows.map(row => {
        const [match] = collection.find({ id: row[otherKey] });
        return match;
      });
    };
  }
}

module.exports = Collection;
