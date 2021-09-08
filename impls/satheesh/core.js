const { readFileSync } = require('fs');
const { Env } = require('./env');
const { Symbol, Nil, List, Str, Atom, Fn, Vector } = require('./types');
const pr_str = require('./printer');
const read_str = require('./reader');
const core = new Env(null);

core.set(new Symbol('+'), new Fn((a, b) => a + b));
core.set(new Symbol('-'), new Fn((a, b) => a - b));
core.set(new Symbol('*'), new Fn((a, b) => a * b));
core.set(new Symbol('/'), new Fn((a, b) => a / b));

core.set(
  new Symbol('prn'),
  new Fn(function (...x) {
    const stringValues = x.map(pr_str);
    console.log(stringValues.join(' '));
    return new Nil();
  })
);

core.set(
  new Symbol('pr-str'),
  new Fn(function (...x) {
    const stringValues = x.map(pr_str);
    return new Str(stringValues.join(' '));
  })
);

core.set(
  new Symbol('println'),
  new Fn(function (...x) {
    const stringValues = x.map(pr_str);
    console.log(stringValues.join(' '));
    return new Nil();
  })
);

core.set(
  new Symbol('str'),
  new Fn(function (...x) {
    const stringValues = x.map(pr_str);
    return new Str(stringValues.join(''));
  })
);

core.set(
  new Symbol('list'),
  new Fn(function (...elements) {
    return new List(elements);
  })
);

core.set(new Symbol('list?'), new Fn(element => element instanceof List));
core.set(new Symbol('empty?'), new Fn(element => element.isEmpty()));
core.set(new Symbol('count'), new Fn(element => element.count()));
core.set(
  new Symbol('='),
  new Fn((a, b) => {
    try {
      return a.equalsTo(b);
    } catch (error) {
      return a === b;
    }
  })
);
core.set(new Symbol('<='), new Fn((a, b) => a <= b));
core.set(new Symbol('>='), new Fn((a, b) => a >= b));
core.set(new Symbol('>'), new Fn((a, b) => a > b));
core.set(new Symbol('<'), new Fn((a, b) => a < b));

core.set(
  new Symbol('read-string'),
  new Fn(str => {
    return read_str(str.str);
  })
);

core.set(
  new Symbol('slurp'),
  new Fn(fileName => {
    try {
      return new Str(readFileSync(fileName.str, 'utf-8'));
    } catch (error) {
      throw 'File not found';
    }
  })
);

core.set(new Symbol('atom'), new Fn(ast => new Atom(ast)));
core.set(new Symbol('atom?'), new Fn(element => element instanceof Atom));
core.set(new Symbol('deref'), new Fn(atom => atom.ast));
core.set(new Symbol('reset!'), new Fn((atom, mal) => atom.reset(mal)));
core.set(
  new Symbol('swap!'),
  new Fn((atom, func, ...args) => {
    return atom.reset(func.apply([atom.ast, ...args]));
  })
);

core.set(
  new Symbol('cons'),
  new Fn((element, seq) => {
    return seq.cons(element);
  })
);

core.set(
  new Symbol('concat'),
  new Fn((...lists) => {
    const list = new List([]);
    return lists.reduce((a, b) => a.concat(b), list);
  })
);

core.set(new Symbol('vec'), new Fn(seq => new Vector(seq.ast.slice())));

module.exports = { core };
