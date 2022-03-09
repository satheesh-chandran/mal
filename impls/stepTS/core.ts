import { Env } from './env';
import { print_str } from './printer';
import {
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
      return new MalBoolean(a.equals(b));
    } catch (error) {
      return new MalBoolean(false);
    }
  })
);

export default coreEnv;
