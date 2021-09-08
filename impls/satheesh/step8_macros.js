const readline = require('readline');

const read_str = require('./reader');
const pr_str = require('./printer');
const { List, Vector, Nil, Symbol, Str, HashMap, Fn } = require('./types');
const { core } = require('./core');
const { Env } = require('./env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const eval_ast = function (ast, env) {
  if (ast === undefined) {
    return new Nil();
  }
  if (ast instanceof Symbol) {
    return env.get(ast);
  }
  if (ast instanceof List) {
    const newList = ast.ast.map(x => EVAL(x, env));
    return new List(newList);
  }
  if (ast instanceof Vector) {
    const newVector = ast.ast.map(x => EVAL(x, env));
    return new Vector(newVector);
  }

  if (ast instanceof HashMap) {
    const newList = [];
    for (let [k, v] of ast.hashmap.entries()) {
      newList.push(EVAL(k, env));
      newList.push(EVAL(v, env));
    }
    return new HashMap(newList);
  }
  return ast;
};

const quasiquote = ast => {
  if (ast instanceof List && ast.beginsWith('unquote')) {
    return ast.ast[1];
  }
  if (ast instanceof List) {
    let result = new List([]);
    for (let i = ast.ast.length - 1; i >= 0; i--) {
      const elt = ast.ast[i];
      if (elt instanceof List && elt.beginsWith('splice-unquote')) {
        result = new List([new Symbol('concat'), elt.ast[1], result]);
      } else {
        result = new List([new Symbol('cons'), quasiquote(elt), result]);
      }
    }
    return result;
  }
  if (ast instanceof Vector) {
    let result = new List([]);
    for (let i = ast.ast.length - 1; i >= 0; i--) {
      const elt = ast.ast[i];
      if (elt instanceof List && elt.beginsWith('splice-unquote')) {
        result = new List([new Symbol('concat'), elt.ast[1], result]);
      } else {
        result = new List([new Symbol('cons'), quasiquote(elt), result]);
      }
    }
    return new List([new Symbol('vec'), result]);
  }
  if (ast instanceof Symbol || ast instanceof HashMap) {
    return new List([new Symbol('quote'), ast]);
  }
  return ast;
};

const is_macro_call = function (ast, env) {
  if (!(ast instanceof List)) return false;
  const elt = ast.ast[0];
  return (
    elt instanceof Symbol &&
    env.find(elt) &&
    env.get(elt) instanceof Fn &&
    env.get(elt).is_macro
  );
};

const macroExpand = (ast, env) => {
  while (is_macro_call(ast, env)) {
    const macro = env.get(ast.ast[0]);
    ast = macro.apply(ast.ast.slice(1));
  }
  return ast;
};

const READ = str => read_str(str);
const EVAL = (ast, env) => {
  while (true) {
    ast = macroExpand(ast, env);
    if (!(ast instanceof List)) {
      return eval_ast(ast, env);
    }
    if (ast.isEmpty()) {
      return ast;
    }

    switch (ast.ast[0].symbol) {
      case 'def!':
        if (ast.ast.length !== 3) throw 'Incorrect number of arguments to def!';
        return env.set(ast.ast[1], EVAL(ast.ast[2], env));
      case 'defmacro!':
        if (ast.ast.length !== 3) throw 'Incorrect number of arguments to def!';
        const val = EVAL(ast.ast[2], env);
        val.is_macro = true;
        return env.set(ast.ast[1], val);
      case 'let*':
        const newEnv = new Env(env);
        const bindings = ast.ast[1].ast;
        for (let i = 0; i < bindings.length; i += 2) {
          newEnv.set(bindings[i], EVAL(bindings[i + 1], newEnv));
        }
        env = newEnv;
        ast = ast.ast[2];
        break;
      case 'if':
        const resultOfCondition = EVAL(ast.ast[1], env);
        ast =
          resultOfCondition === false || resultOfCondition instanceof Nil
            ? ast.ast[3]
            : ast.ast[2];
        break;
      case 'do':
        ast.ast.slice(1, -1).forEach(exprs => {
          EVAL(exprs, env);
        });
        ast = ast.ast[ast.ast.length - 1];
        break;
      case 'fn*':
        const binds = ast.ast[1].ast;
        const fnBody = ast.ast[2];
        const fn = function (...values) {
          const newEnv = new Env(env, binds, values);
          return EVAL(fnBody, newEnv);
        };
        return new Fn(fn, fnBody, ast.ast[1], env);
      case 'quote':
        return ast.ast[1];
      case 'quasiquoteexpand':
        return quasiquote(ast.ast[1]);
      case 'quasiquote':
        ast = quasiquote(ast.ast[1]);
        continue;
      case 'macroexpand':
        return macroExpand(ast.ast[1], env);
      default:
        const newList = eval_ast(ast, env);
        const func = newList.ast[0];

        if (func.ast) {
          ast = func.ast;
          env = new Env(func.env, func.params.ast, newList.ast.slice(1));
          continue;
        }

        return func.apply(newList.ast.slice(1));
    }
  }
};
const PRINT = ast => pr_str(ast);

const env = new Env(core);

env.set(
  new Symbol('eval'),
  new Fn(function (ast) {
    return EVAL(ast, env);
  })
);

env.set(
  new Symbol('*ARGV*'),
  new List(process.argv.slice(3).map(s => new Str(s)))
);

const rep = str => PRINT(EVAL(READ(str), env));
rep('(def! not (fn* (a) (if a false true)))');
rep('(def! inc1 (fn* (a) (+ a 1)))');
rep('(def! inc2 (fn* (a) (+ a 2)))');
rep('(def! inc3 (fn* (a) (+ a 3)))');
rep('(def! inc4 (fn* (a) (+ a 4)))');
rep('(def! inc5 (fn* (a) (+ a 5)))');
rep(
  '(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))'
);
rep(
  '(defmacro! if-not (fn* [expr if-part else-part] `(if (not ~expr) ~if-part ~else-part)))'
);
// rep(
//   '(defmacro! cond (fn* (& xs) (if (> (count xs) 0) (list \'if (first xs) (if (> (count xs) 1) (nth xs 1) (throw "odd number of forms to cond")) (cons \'cond (rest (rest xs)))))))'
// );

const loop = function () {
  rl.question('user> ', answer => {
    try {
      console.log(rep(answer));
    } catch (error) {
      console.log(error);
    } finally {
      loop();
    }
  });
};

loop();

/*

(def! sum (fn* [x y] (if (<= x 0) y (sum (- x 1) (+ x y))))))

*/
