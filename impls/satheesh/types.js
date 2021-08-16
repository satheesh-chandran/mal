class List {
  constructor(ast) {
    this.ast = ast;
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
}

class Str {
  constructor(str) {
    this.str = str;
  }

  toString() {
    return '"' + this.str + '"';
  }
}

class Symbol {
  constructor(symbol) {
    this.symbol = symbol;
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

module.exports = { List, Vector, Nil, Symbol, Str, HashMap, Keyword, Fn };
