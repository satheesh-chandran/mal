import * as readline from 'readline';
import { print_str } from './printer';
import { read_str } from './reader';
import {
  MalF,
  MalList,
  MalMap,
  MalNumber,
  MalSymbol,
  MalType,
  MalVector
} from './types';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envCore = new Map<string, MalF>();
envCore.set('+', (a: MalNumber, b: MalNumber) => new MalNumber(a.num + b.num));
envCore.set('-', (a: MalNumber, b: MalNumber) => new MalNumber(a.num - b.num));
envCore.set('*', (a: MalNumber, b: MalNumber) => new MalNumber(a.num * b.num));
envCore.set('/', (a: MalNumber, b: MalNumber) => new MalNumber(a.num / b.num));

const eval_ast = function (ast: MalType, env: Map<string, MalF>): MalType {
  if (ast instanceof MalSymbol) {
    const malSymbol: MalSymbol = ast as MalSymbol;
    const fun = env.get(malSymbol.sym);
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

const EVAL = (ast: MalType, env: Map<string, MalF>): MalType => {
  if (!(ast instanceof MalList)) {
    return eval_ast(ast, env);
  }
  if (ast instanceof MalList && (ast as MalList).list.length === 0) {
    return ast;
  }
  const resultList: MalType = eval_ast(ast, env);
  const [fun, ...args] = (resultList as MalList).list;
  return (fun as MalF)(...args);
};

const rep = (str: string) => PRINT(EVAL(READ(str), envCore));

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
