const { readFileSync } = require('fs');
const { Env } = require('./env');
const { Symbol, Nil, List, Str, Atom } = require('./types');
const pr_str = require('./printer');
const read_str = require('./reader');
const core = new Env(null);

core.set(new Symbol('+'), (a, b) => a + b);
core.set(new Symbol('-'), (a, b) => a - b);
core.set(new Symbol('*'), (a, b) => a * b);
core.set(new Symbol('/'), (a, b) => a / b);

core.set(new Symbol('prn'), function (...x) {
  const stringValues = x.map(pr_str);
  console.log(stringValues.join(' '));
  return new Nil();
});

core.set(new Symbol('pr-str'), function (...x) {
  const stringValues = x.map(pr_str);
  return new Str(stringValues.join(' '));
});

core.set(new Symbol('println'), function (...x) {
  const stringValues = x.map(pr_str);
  console.log(stringValues.join(' '));
  return new Nil();
});

core.set(new Symbol('str'), function (...x) {
  const stringValues = x.map(pr_str);
  return new Str(stringValues.join(''));
});

core.set(new Symbol('list'), function (...elements) {
  return new List(elements);
});

core.set(new Symbol('list?'), element => element instanceof List);
core.set(new Symbol('empty?'), element => element.isEmpty());
core.set(new Symbol('count'), element => element.count());
core.set(new Symbol('='), (a, b) => {
  try {
    return a.equalsTo(b);
  } catch (error) {
    return a === b;
  }
});
core.set(new Symbol('<='), (a, b) => a <= b);
core.set(new Symbol('>='), (a, b) => a >= b);
core.set(new Symbol('>'), (a, b) => a > b);
core.set(new Symbol('<'), (a, b) => a < b);

core.set(new Symbol('read-string'), str => read_str(str.str));

core.set(new Symbol('slurp'), fileName => readFileSync(fileName.str, 'utf-8'));

core.set(new Symbol('atom'), ast => new Atom(ast));
core.set(new Symbol('atom?'), element => element instanceof Atom);
core.set(new Symbol('deref'), atom => atom.ast);
core.set(new Symbol('reset!'), (atom, mal) => atom.reset(mal));
// core.set(new Symbol('swap!'), (atom, func, ...args) => {
//   return atom.reset(func(atom.ast, ...args));
// });

module.exports = { core };
