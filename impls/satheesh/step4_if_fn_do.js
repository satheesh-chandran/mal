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

const READ = str => read_str(str);
const EVAL = (ast, env) => {
  if (!(ast instanceof List)) {
    return eval_ast(ast, env);
  }
  if (ast.isEmpty()) {
    return ast;
  }

  switch (ast.ast[0].symbol) {
    case 'def!':
      return env.set(ast.ast[1], EVAL(ast.ast[2], env));
    case 'let*':
      const newEnv = new Env(env);
      const bindings = ast.ast[1].ast;
      for (let i = 0; i < bindings.length; i += 2) {
        newEnv.set(bindings[i], EVAL(bindings[i + 1], newEnv));
      }
      return EVAL(ast.ast[2], newEnv);
    case 'if':
      const resultOfCondition = EVAL(ast.ast[1], env);
      return resultOfCondition === false || resultOfCondition instanceof Nil
        ? EVAL(ast.ast[3], env)
        : EVAL(ast.ast[2], env);
    case 'do':
      let resultOfEachExpressions = new Nil();
      ast.ast.slice(1).forEach(exprs => {
        resultOfEachExpressions = EVAL(exprs, env);
      });
      return resultOfEachExpressions;
    case 'fn*':
      const binds = ast.ast[1].ast;
      const fnBody = ast.ast[2];
      const fn = function (...fnArgs) {
        const newEnv = new Env(env, binds, fnArgs);
        return EVAL(fnBody, newEnv);
      };
      return new Fn(fn);
    default:
      const newList = eval_ast(ast, env);
      const func = newList.ast[0];
      return func.apply(newList.ast.slice(1));
  }
};
const PRINT = ast => pr_str(ast);

const env = new Env(core);

const rep = str => PRINT(EVAL(READ(str), env));
rep('(def! not (fn* (a) (if a false true)))');

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
