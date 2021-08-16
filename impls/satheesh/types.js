class Num {
  constructor(num) {
    this.num = num;
  }

  toString() {
    return this.num.toString();
  }

  equalsTo(other) {
    return other instanceof Num ? this.num === other.num : false;
  }
}

class List {
  constructor(ast) {
    this.ast = ast;
  }

  equalsTo(other) {
    if (!(other instanceof Vector || other instanceof List)) {
      return false;
    }

    if (this.count().num !== other.count().num) {
      return false;
    }

    return this.ast.every((x, i) => {
      return this.ast[i].equalsTo(other.ast[i]);
    });
  }

  toString() {
    return '(' + this.ast.map(a => a.toString()).join(' ') + ')';
  }

  count() {
    return new Num(this.ast.length);
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
    return new Num(this.ast.length);
  }

  equalsTo(other) {
    if (!(other instanceof Vector || other instanceof List)) {
      return false;
    }

    if (this.count().num !== other.count().num) {
      return false;
    }

    return this.ast.every((x, i) => {
      return this.ast[i].equalsTo(other.ast[i]);
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

  count() {
    return new Num(this.hashmap.size);
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
    return new Num(0);
  }
}

class Str {
  constructor(str) {
    this.str = str;
  }

  count() {
    return new Num(this.str.length);
  }

  equalsTo(other) {
    return other instanceof Str ? this.str === other.str : false;
  }

  toString() {
    return '"' + this.str + '"';
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

class Fn {
  constructor(fn) {
    this.fn = fn;
  }

  toString() {
    return '#<function>';
  }

  apply(args) {
    return this.fn.apply(null, args);
  }
}

module.exports = { List, Vector, Nil, Symbol, Str, HashMap, Keyword, Fn, Num };
