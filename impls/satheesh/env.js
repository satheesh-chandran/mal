class Env {
  constructor(outer) {
    this.outer = outer;
    this.data = {};
  }

  set(key, value) {
    this.data[key.symbol] = value;
    return value;
  }

  get(key) {
    const symbol = key.symbol;
    const env = this.find(symbol);
    if (!env) {
      throw `'${symbol} not found`;
    }
    return env.data[symbol];
  }

  find(key) {
    if (key in this.data) {
      return this;
    }
    if (!this.outer) {
      return null;
    }
    return this.outer.find(key);
  }
}

module.exports = { Env };
