const { List, Vector, Nil, Symbol, Str, HashMap, Keyword } = require('./types');

const tokenize = str => {
  const reg = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  let match;
  const results = [];
  while ((match = reg.exec(str)[1]) !== '') {
    if (match[0] != ';') {
      results.push(match);
    }
  }
  return results;
};

class Reader {
  constructor(tokens) {
    this.tokens = tokens.slice();
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const currentToken = this.peek();
    if (currentToken) {
      this.position++;
    }
    return currentToken;
  }
}

const read_atom = function (token) {
  if (token.match(/^-?[0-9]+$/)) {
    return parseInt(token);
  }
  if (token.match(/^-?[0-9]+\.[0-9]+$/)) {
    return parseFloat(token);
  }
  if (token === 'true') {
    return true;
  }
  if (token === 'false') {
    return false;
  }
  if (token === 'nil') {
    return new Nil();
  }
  if (token.startsWith('"')) {
    if (!/[^\\]"$/.test(token)) {
      throw 'unbalanced';
    }
    return new Str(token.substring(1, token.length - 1));
  }
  if (token.startsWith(':')) {
    return new Keyword(token.slice(1));
  }
  return new Symbol(token);
};

const read_seq = function (reader, closing) {
  const ast = [];
  let token;
  while ((token = reader.peek()) !== closing) {
    if (!reader.peek()) {
      throw 'unbalanced';
    }
    ast.push(read_form(reader));
  }
  reader.next();
  return ast;
};

const read_list = function (reader) {
  const ast = read_seq(reader, ')');
  return new List(ast);
};

const read_vector = function (reader) {
  const ast = read_seq(reader, ']');
  return new Vector(ast);
};

const read_hash = function (reader) {
  const ast = read_seq(reader, '}');
  if (ast.length % 2 !== 0) {
    throw 'odd number entry in map';
  }
  return new HashMap(ast);
};

const read_form = function (reader) {
  const token = reader.peek();
  switch (token[0]) {
    case '(':
      reader.next();
      return read_list(reader);
    case '[':
      reader.next();
      return read_vector(reader);
    case '{':
      reader.next();
      return read_hash(reader);
    case ')':
      throw 'unexpected';
    case ']':
      throw 'unexpected';
    case '}':
      throw 'unexpected';
  }
  reader.next();
  return read_atom(token);
};

const read_str = function (str) {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = read_str;
