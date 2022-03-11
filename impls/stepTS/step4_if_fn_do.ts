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
    const malMap: MalMap = ast as MalMap;
    return new MalMap(
      malMap
        .entries()
        .flat()
        .map(ast => EVAL(ast, env))
    );
  }
  return ast;
};

const READ = (str: string): MalType => read_str(str);
const PRINT = (ast: MalType): string => print_str(ast);

const EVAL = (ast: MalType, env: Env): MalType => {
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
      return EVAL(newAst.list[2], newEnv);
    case 'if':
      const res = EVAL(newAst.list[1], env);
      const isFalseCase: boolean =
        res instanceof MalNil ||
        (res instanceof MalBoolean && (res as MalBoolean).value === false);

      return isFalseCase
        ? EVAL(newAst.list[3], env)
        : EVAL(newAst.list[2], env);
    case 'do':
      const results: MalType[] = newAst.list
        .slice(1)
        .map((childAst: MalType) => {
          return EVAL(childAst, env);
        });
      return results[results.length - 1];
    case 'fn*':
      const binds = (newAst.list[1] as MalList).list;
      const fnBody = newAst.list[2];
      const fn = function (...args: MalType[]) {
        const fnEnv = new Env(env, binds as MalSymbol[], args);
        return EVAL(fnBody, fnEnv);
      };
      return new MalFunction(fn);
    default:
      const resultList: MalType = eval_ast(ast, env);
      const [fun, ...args] = (resultList as MalList).list;
      return (fun as MalFunction).apply(args);
  }
};

const rep = (str: string) => PRINT(EVAL(READ(str), env));

rep('(def! not (fn* (a) (if a false true)))');
rep(`(def! fib (fn* [n] (if (<= n 1) n 
       (+ (fib (- n 1)) (fib (- n 2))))))`);

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
