const { Env } = require('./env');
class List {
  constructor(ast) {
    this.ast = ast;
  }

  equalsTo(other) {
    if (!(other instanceof Vector || other instanceof List)) {
      return false;
    }

    if (this.count() !== other.count()) {
      return false;
    }

    return this.ast.every((x, i) => {
      try {
        return this.ast[i].equalsTo(other.ast[i]);
      } catch (error) {
        return this.ast[i] === other.ast[i];
      }
    });
  }

  toString() {
    return '(' + this.ast.map(a => a.toString()).join(' ') + ')';
  }

  count() {
    return this.ast.length;
  }

  isEmpty() {
    return this.ast.length === 0;
  }
}

class Vector {
  constructor(ast) {
    this.ast = ast;
  }

  count() {
    return this.ast.length;
  }

  equalsTo(other) {
    if (!(other instanceof Vector || other instanceof List)) {
      return false;
    }

    if (this.count() !== other.count()) {
      return false;
    }
    return this.ast.every((x, i) => {
      try {
        return this.ast[i].equalsTo(other.ast[i]);
      } catch (error) {
        return this.ast[i] === other.ast[i];
      }
    });
  }

  isEmpty() {
    return this.ast.length === 0;
  }

  toString() {
    return '[' + this.ast.map(a => a.toString()).join(' ') + ']';
  }
}

class HashMap {
  constructor(ast) {
    this.hashmap = new Map();
    for (let index = 0; index < ast.length; index += 2) {
      this.hashmap.set(ast[index], ast[index + 1]);
    }
  }

  equalsTo(other) {
    if (!(other instanceof HashMap) && this.count() !== other.count()) {
      return false;
    }

    let isEqual = true;
    for (let [key, val] of this.hashmap) {
      isEqual = isEqual && other.hashmap.get(key).equalsTo(val);
    }
    return isEqual;
  }

  count() {
    return this.hashmap.size;
  }

  isEmpty() {
    return this.hashmap.size === 0;
  }

  toString() {
    let str = '';
    let separator = '';
    for (let [k, v] of this.hashmap.entries()) {
      str += separator + k.toString();
      str += ' ';
      str += v.toString();
      separator = ' ';
    }
    return '{' + str + '}';
  }
}

class Nil {
  constructor() {}
  toString() {
    return 'nil';
  }

  equalsTo(other) {
    return other instanceof Nil;
  }

  count() {
    return 0;
  }
}

class Str {
  constructor(str) {
    this.str = str;
  }

  count() {
    return this.str.length;
  }

  equalsTo(other) {
    return other instanceof Str ? this.str === other.str : false;
  }

  toString() {
    return '"' + this.str.toString() + '"';
  }
}

class Symbol {
  constructor(symbol) {
    this.symbol = symbol;
  }

  equalsTo(other) {
    return other instanceof Symbol ? this.symbol === other.symbol : false;
  }

  toString() {
    return this.symbol.toString();
  }
}

class Keyword {
  constructor(Keyword) {
    this.Keyword = Keyword;
  }

  toString() {
    return ':' + this.Keyword.toString();
  }

  equalsTo(other) {
    return other instanceof Keyword ? this.Keyword === other.Keyword : false;
  }
}

class Atom {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return `(atom ${this.ast.toString()})`;
  }

  reset(newAst) {
    this.ast = newAst;
    return newAst;
  }

  equalsTo(other) {
    return other instanceof Atom ? this.ast === other.ast : false;
  }
}
class Fn {
  constructor(fn, ast, params, env) {
    this.fn = fn;
    this.ast = ast;
    this.params = params;
    this.env = env;
  }

  apply(params) {
    return this.fn.apply(null, params);
  }

  toString() {
    return '#<function>';
  }
}

module.exports = { List, Vector, Nil, Symbol, Str, HashMap, Keyword, Fn, Atom };
