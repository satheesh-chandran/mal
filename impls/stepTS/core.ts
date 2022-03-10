import { readFileSync } from 'fs';
import { Env } from './env';
import { print_str } from './printer';
import { read_str } from './reader';
import {
  MalAtom,
  MalBoolean,
  MalFunction,
  MalList,
  MalNil,
  MalNumber,
  MalString,
  MalSymbol,
  MalType
} from './types';

const coreEnv: Env = new Env(null);

coreEnv.set(
  MalSymbol.get('+'),
  new MalFunction((a: MalNumber, b: MalNumber) => new MalNumber(a.num + b.num))
);

coreEnv.set(
  MalSymbol.get('-'),
  new MalFunction((a: MalNumber, b: MalNumber) => new MalNumber(a.num - b.num))
);

coreEnv.set(
  MalSymbol.get('*'),
  new MalFunction((a: MalNumber, b: MalNumber) => new MalNumber(a.num * b.num))
);

coreEnv.set(
  MalSymbol.get('/'),
  new MalFunction((a: MalNumber, b: MalNumber) => new MalNumber(a.num / b.num))
);

coreEnv.set(
  MalSymbol.get('read-string'),
  new MalFunction(
    (str: MalString): MalType => {
      return read_str(str.str);
    }
  )
);

coreEnv.set(
  MalSymbol.get('slurp'),
  new MalFunction(
    (filename: MalString): MalType => {
      return new MalString(readFileSync(filename.str, 'utf-8'));
    }
  )
);

coreEnv.set(
  MalSymbol.get('prn'),
  new MalFunction(function (...args: MalType[]): MalType {
    const values: string[] = args.map((arg: MalType) => print_str(arg, true));
    console.log(values.join(' '));
    return MalNil.Instance;
  })
);

coreEnv.set(
  MalSymbol.get('pr-str'),
  new MalFunction(function (...args: MalType[]): MalType {
    const values: string[] = args.map((arg: MalType) => print_str(arg, true));
    return new MalString(values.join(' '));
  })
);

coreEnv.set(
  MalSymbol.get('str'),
  new MalFunction(function (...args: MalType[]): MalType {
    const values: string[] = args.map((arg: MalType) => print_str(arg, false));
    return new MalString(values.join(''));
  })
);

coreEnv.set(
  MalSymbol.get('println'),
  new MalFunction(function (...args: MalType[]): MalType {
    const values: string[] = args.map((arg: MalType) => print_str(arg, false));
    // process.stdout.write(values.join(' '));
    console.log(values.join(' '));
    return MalNil.Instance;
  })
);

coreEnv.set(
  MalSymbol.get('list'),
  new MalFunction(function (...args: MalType[]): MalType {
    return new MalList(args);
  })
);

coreEnv.set(
  MalSymbol.get('list?'),
  new MalFunction(function (arg: MalType): MalType {
    return new MalBoolean(arg instanceof MalList);
  })
);

coreEnv.set(
  MalSymbol.get('empty?'),
  new MalFunction(function (list: MalList): MalType {
    return new MalBoolean(list.list.length == 0);
  })
);

coreEnv.set(
  MalSymbol.get('count'),
  new MalFunction(function (list: MalList): MalType {
    try {
      return new MalNumber(list.list.length);
    } catch (error) {
      return new MalNumber(0);
    }
  })
);

coreEnv.set(
  MalSymbol.get('<'),
  new MalFunction(function (a: MalNumber, b: MalNumber): MalType {
    return new MalBoolean(a.num < b.num);
  })
);

coreEnv.set(
  MalSymbol.get('>'),
  new MalFunction(function (a: MalNumber, b: MalNumber): MalType {
    return new MalBoolean(a.num > b.num);
  })
);

coreEnv.set(
  MalSymbol.get('<='),
  new MalFunction(function (a: MalNumber, b: MalNumber): MalType {
    return new MalBoolean(a.num <= b.num);
  })
);

coreEnv.set(
  MalSymbol.get('>='),
  new MalFunction(function (a: MalNumber, b: MalNumber): MalType {
    return new MalBoolean(a.num >= b.num);
  })
);

coreEnv.set(
  MalSymbol.get('='),
  new MalFunction(function (a: MalType, b: MalType): MalType {
    try {
      //@ts-ignore
      return a.equals(b);
    } catch (error) {
      return new MalBoolean(false);
    }
  })
);

coreEnv.set(
  MalSymbol.get('atom'),
  new MalFunction(function (el: MalType): MalAtom {
    return new MalAtom(el);
  })
);

coreEnv.set(
  MalSymbol.get('atom?'),
  new MalFunction(function (el: MalType): MalBoolean {
    return new MalBoolean(el instanceof MalAtom);
  })
);

coreEnv.set(
  MalSymbol.get('deref'),
  new MalFunction(function (el: MalAtom): MalType {
    return el.ast;
  })
);

coreEnv.set(
  MalSymbol.get('reset!'),
  new MalFunction(function (el: MalAtom, newAst: MalType): MalType {
    return el.reset(newAst);
  })
);

coreEnv.set(
  MalSymbol.get('swap!'),
  new MalFunction((atom: MalAtom, func: MalFunction, ...args: MalType[]) => {
    return atom.reset(func.apply([atom.ast, ...args]));
  })
);

export default coreEnv;
