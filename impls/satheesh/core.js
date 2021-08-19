const { Env } = require('./env');
const { Symbol, Nil, List, Str } = require('./types');
const pr_str = require('./printer');
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

module.exports = { core };
