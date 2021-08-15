class List {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return '(' + this.ast.map(a => a.toString()).join(' ') + ')';
  }

  isEmpty() {
    return this.ast.length === 0;
  }
}

class Vector {
  constructor(ast) {
    this.ast = ast;
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

module.exports = { List, Vector, Nil, Symbol, Str, HashMap, Keyword };
