const { Env } = require('./env');
const { Symbol, Fn, Nil, List, Str, Num } = require('./types');
const pr_str = require('./printer');
const core = new Env(null);

core.set(new Symbol('+'), new Fn((a, b) => new Num(a.num + b.num)));
core.set(new Symbol('-'), new Fn((a, b) => new Num(a.num - b.num)));
core.set(new Symbol('*'), new Fn((a, b) => new Num(a.num * b.num)));
core.set(new Symbol('/'), new Fn((a, b) => new Num(a.num / b.num)));

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
core.set(
  new Symbol('<='),
  new Fn((a, b) => {
    return a.num <= b.num;
  })
);
core.set(
  new Symbol('>='),
  new Fn((a, b) => {
    return a.num >= b.num;
  })
);
core.set(
  new Symbol('>'),
  new Fn((a, b) => {
    return a.num > b.num;
  })
);
core.set(
  new Symbol('<'),
  new Fn((a, b) => {
    return a.num < b.num;
  })
);

module.exports = { core };
