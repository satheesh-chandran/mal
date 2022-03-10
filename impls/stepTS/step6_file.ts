import * as readline from 'readline';
import { print_str } from './printer';
import { read_str } from './reader';
import { Env } from './env';
import {
  MalBoolean,
  MalFunction,
  MalList,
  MalMap,
  MalNil,
  MalString,
  MalSymbol,
  MalType,
  MalVector
} from './types';
import coreEnv from './core';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const env: Env = new Env(coreEnv);

const eval_ast = function (ast: MalType, env: Env): MalType {
  if (ast instanceof MalSymbol) {
    const malSymbol: MalSymbol = ast as MalSymbol;
    const fun = env.get(malSymbol);
    if (!fun) {
      throw new Error(`unknown symbol: ${malSymbol.sym}`);
    }
    return fun;
  }
  if (ast instanceof MalList) {
    const malList: MalList = ast as MalList;
    return new MalList(malList.list.map(ast => EVAL(ast, env)));
  }
  if (ast instanceof MalVector) {
    const malList: MalVector = ast as MalVector;
    return new MalVector(malList.list.map(ast => EVAL(ast, env)));
  }
  if (ast instanceof MalMap) {
    const malList: MalMap = ast as MalMap;
    return new MalMap(malList.list.map(ast => EVAL(ast, env)));
  }
  return ast;
};

const READ = (str: string): MalType => read_str(str);
const PRINT = (ast: MalType): string => print_str(ast);

const EVAL = (ast: MalType, env: Env): MalType => {
  cycle: while (true) {
    if (!ast) return MalNil.Instance;
    if (!(ast instanceof MalList)) {
      return eval_ast(ast, env);
    }
    if (ast instanceof MalList && (ast as MalList).list.length === 0) {
      return ast;
    }

    const newAst: MalList = ast as MalList;

    switch ((newAst.list[0] as MalSymbol).sym) {
      case 'def!':
        return env.set(newAst.list[1] as MalSymbol, EVAL(newAst.list[2], env));
      case 'let*':
        const newEnv: Env = new Env(env);
        const bindings = (newAst.list[1] as MalList).list;
        for (let i = 0; i < bindings.length; i += 2) {
          newEnv.set(bindings[i] as MalSymbol, EVAL(bindings[i + 1], newEnv));
        }
        env = newEnv;
        ast = newAst.list[2];
        continue cycle;
      case 'if':
        const res = EVAL(newAst.list[1], env);
        const cond =
          res instanceof MalNil || (res as MalBoolean).value == false;
        ast = cond ? newAst.list[3] : newAst.list[2];
        continue cycle;
      case 'do':
        newAst.list.slice(1).map((childAst: MalType) => {
          EVAL(childAst, env);
        });
        ast = newAst.list[newAst.list.length - 1];
        continue cycle;
      case 'fn*':
        const [, params, bodyAst] = newAst.list;
        const binds = (newAst.list[1] as MalList).list;
        const fn = function (...args: MalType[]) {
          const fnEnv = new Env(env, binds as MalSymbol[], args);
          return EVAL(bodyAst, fnEnv);
        };
        return new MalFunction(
          fn,
          bodyAst,
          (params as MalList).list as MalSymbol[],
          env
        );
      default:
        const resultList: MalType = eval_ast(ast, env);
        const [fun, ...args] = (resultList as MalList).list;

        const func: MalFunction = fun as MalFunction;
        if (!func.env) {
          return func.apply(args);
        }
        ast = func.ast as MalType;
        env = new Env(func.env as Env, func.params, args);
        continue cycle;
    }
  }
};

env.set(
  MalSymbol.get('eval'),
  new MalFunction(function (ast: MalList) {
    return EVAL(ast, env);
  })
);

env.set(
  MalSymbol.get('*ARGV*'),
  new MalList(process.argv.slice(3).map(s => new MalString(s)))
);

const rep = (str: string) => PRINT(EVAL(READ(str), env));

rep('(def! not (fn* (a) (if a false true)))');
rep('(def! inc1 (fn* (a) (+ a 1)))');
rep('(def! inc2 (fn* (a) (+ a 2)))');
rep('(def! inc3 (fn* (a) (+ a 3)))');
rep('(def! inc4 (fn* (a) (+ a 4)))');
rep('(def! inc5 (fn* (a) (+ a 5)))');
rep(`(def! fib (fn* [n] (if (<= n 1) n
       (+ (fib (- n 1)) (fib (- n 2))))))`);
rep('(def! sum2 (fn* (n acc) (if (= n 0) acc (sum2 (- n 1) (+ n acc)))))');
rep(
  '(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))'
);

const loop = function () {
  rl.question('user> ', (answer: string) => {
    try {
      console.log(rep(answer));
    } catch (err: any) {
      const exception: Error = err;
      console.log(exception.message);
    } finally {
      loop();
    }
  });
};

loop();
