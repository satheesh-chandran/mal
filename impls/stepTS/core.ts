import { readline } from './readline';
import { readFileSync } from 'fs';
import { Env } from './env';
import { print_str } from './printer';
import { read_str } from './reader';
import {
  MalAtom,
  MalBoolean,
  MalException,
  MalFunction,
  MalKeyword,
  MalList,
  MalMap,
  MalNil,
  MalNumber,
  MalString,
  MalSymbol,
  MalType,
  MalVector
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
  MalSymbol.get('mod'),
  new MalFunction((a: MalNumber, b: MalNumber) => new MalNumber(a.num % b.num))
);

coreEnv.set(
  MalSymbol.get('even?'),
  new MalFunction((a: MalNumber) => new MalBoolean(a.num % 2 === 0))
);

coreEnv.set(
  MalSymbol.get('odd?'),
  new MalFunction((a: MalNumber) => new MalBoolean(a.num % 2 === 1))
);

coreEnv.set(
  MalSymbol.get('mod'),
  new MalFunction((a: MalNumber, b: MalNumber) => new MalNumber(a.num % b.num))
);

coreEnv.set(
  MalSymbol.get('read-string'),
  new MalFunction((str: MalString) => read_str(str.str))
);

coreEnv.set(
  MalSymbol.get('slurp'),
  new MalFunction(
    (filename: MalString) => new MalString(readFileSync(filename.str, 'utf-8'))
  )
);

coreEnv.set(
  MalSymbol.get('prn'),
  new MalFunction((...args: MalType[]) => {
    const values: string[] = args.map((arg: MalType) => print_str(arg, true));
    console.log(values.join(' '));
    return MalNil.Instance;
  })
);

coreEnv.set(
  MalSymbol.get('pr-str'),
  new MalFunction((...args: MalType[]) => {
    const values: string[] = args.map((arg: MalType) => print_str(arg, true));
    return new MalString(values.join(' '));
  })
);

coreEnv.set(
  MalSymbol.get('str'),
  new MalFunction((...args: MalType[]) => {
    const values: string[] = args.map((arg: MalType) => print_str(arg, false));
    return new MalString(values.join(''));
  })
);

coreEnv.set(
  MalSymbol.get('println'),
  new MalFunction((...args: MalType[]) => {
    const values: string[] = args.map((arg: MalType) => print_str(arg, false));
    console.log(values.join(' '));
    return MalNil.Instance;
  })
);

coreEnv.set(
  MalSymbol.get('list'),
  new MalFunction((...args: MalType[]) => new MalList(args))
);

coreEnv.set(
  MalSymbol.get('list?'),
  new MalFunction((arg: MalType) => new MalBoolean(arg instanceof MalList))
);

coreEnv.set(
  MalSymbol.get('number?'),
  new MalFunction((arg: MalType) => new MalBoolean(arg instanceof MalNumber))
);

coreEnv.set(
  MalSymbol.get('string?'),
  new MalFunction((arg: MalType) => new MalBoolean(arg instanceof MalString))
);

coreEnv.set(
  MalSymbol.get('fn?'),
  new MalFunction((arg: MalType) => new MalBoolean(arg instanceof MalFunction))
);

coreEnv.set(
  MalSymbol.get('empty?'),
  new MalFunction((list: MalList | MalVector | MalString) => list.isEmpty())
);

coreEnv.set(
  MalSymbol.get('count'),
  new MalFunction((list: MalList) => {
    try {
      return new MalNumber(list.list.length);
    } catch (error) {
      return new MalNumber(0);
    }
  })
);

coreEnv.set(
  MalSymbol.get('<'),
  new MalFunction((a: MalNumber, b: MalNumber) => new MalBoolean(a.num < b.num))
);

coreEnv.set(
  MalSymbol.get('>'),
  new MalFunction((a: MalNumber, b: MalNumber) => new MalBoolean(a.num > b.num))
);

coreEnv.set(
  MalSymbol.get('<='),
  new MalFunction(
    (a: MalNumber, b: MalNumber) => new MalBoolean(a.num <= b.num)
  )
);

coreEnv.set(
  MalSymbol.get('>='),
  new MalFunction(
    (a: MalNumber, b: MalNumber) => new MalBoolean(a.num >= b.num)
  )
);

coreEnv.set(
  MalSymbol.get('='),
  new MalFunction((a: MalType, b: MalType) => {
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
  new MalFunction((el: MalType) => new MalAtom(el))
);

coreEnv.set(
  MalSymbol.get('atom?'),
  new MalFunction((el: MalType) => new MalBoolean(el instanceof MalAtom))
);

coreEnv.set(MalSymbol.get('deref'), new MalFunction((el: MalAtom) => el.ast));

coreEnv.set(
  MalSymbol.get('reset!'),
  new MalFunction((el: MalAtom, newAst: MalType) => el.reset(newAst))
);

coreEnv.set(
  MalSymbol.get('swap!'),
  new MalFunction((atom: MalAtom, func: MalFunction, ...args: MalType[]) => {
    return atom.reset(func.apply([atom.ast, ...args]));
  })
);

coreEnv.set(
  MalSymbol.get('cons'),
  new MalFunction((element: MalType, list: MalList | MalVector) => {
    return list.cons(element);
  })
);

coreEnv.set(
  MalSymbol.get('concat'),
  new MalFunction((...lists: MalList[] | MalVector[]) => {
    const list = new MalList([]);
    return lists.reduce(
      (a: MalList | MalVector, b: MalList) => a.concat(b),
      list
    );
  })
);

coreEnv.set(
  MalSymbol.get('vec'),
  new MalFunction((ast: MalList | MalVector) => {
    return ast instanceof MalList ? new MalVector([...ast.list]) : ast;
  })
);

coreEnv.set(
  MalSymbol.get('nth'),
  new MalFunction((ast: MalList | MalVector, index: MalNumber) => {
    const result = ast.list[index.num];
    if (!result) {
      throw new Error('nth: index out of range');
    }
    return result;
  })
);

coreEnv.set(
  MalSymbol.get('first'),
  new MalFunction((ast: MalType) => {
    if (ast instanceof MalList || ast instanceof MalVector) {
      return ast.list.length == 0 ? MalNil.Instance : ast.list[0];
    }
    return MalNil.Instance;
  })
);

coreEnv.set(
  MalSymbol.get('rest'),
  new MalFunction((ast: MalType) => {
    if (!(ast instanceof MalList) && !(ast instanceof MalVector)) {
      return new MalList([]);
    }
    if (ast.list.length == 0) {
      return new MalList([]);
    }
    const [, ...rest] = ast.list;
    return new MalList(rest);
  })
);

coreEnv.set(
  MalSymbol.get('throw'),
  new MalFunction((cause: MalType) => {
    throw new MalException(cause);
  })
);

coreEnv.set(
  MalSymbol.get('apply'),
  new MalFunction((fun: MalFunction, ...args: MalType[]) => {
    const tail = args[args.length - 1];
    if (tail instanceof MalList || tail instanceof MalVector) {
      const listArgs = args.slice(0, -1).concat(tail.list);
      return fun.apply(listArgs);
    }
    throw new Error(`unexpected symbol: expected: list or vector`);
  })
);

coreEnv.set(
  MalSymbol.get('map'),
  new MalFunction((fun: MalFunction, args: MalList | MalVector) => {
    const results: MalType[] = args.list.map((ast: MalType) =>
      fun.apply([ast])
    );
    return new MalList(results);
  })
);

coreEnv.set(
  MalSymbol.get('nil?'),
  new MalFunction((ast: MalType) => new MalBoolean(ast instanceof MalNil))
);

coreEnv.set(
  MalSymbol.get('true?'),
  new MalFunction((ast: MalType) => {
    return ast instanceof MalBoolean
      ? new MalBoolean(ast.value === true)
      : new MalBoolean(false);
  })
);

coreEnv.set(
  MalSymbol.get('false?'),
  new MalFunction((ast: MalType) => {
    return ast instanceof MalBoolean
      ? new MalBoolean(ast.value === false)
      : new MalBoolean(false);
  })
);

coreEnv.set(
  MalSymbol.get('symbol?'),
  new MalFunction((ast: MalType) => new MalBoolean(ast instanceof MalSymbol))
);

coreEnv.set(
  MalSymbol.get('symbol'),
  new MalFunction((name: MalString) => MalSymbol.get(name.str))
);

coreEnv.set(
  MalSymbol.get('keyword'),
  new MalFunction((name: MalType) =>
    name instanceof MalKeyword ? name : MalKeyword.get((name as MalString).str)
  )
);

coreEnv.set(
  MalSymbol.get('keyword?'),
  new MalFunction((name: MalType) => new MalBoolean(name instanceof MalKeyword))
);

coreEnv.set(
  MalSymbol.get('vector?'),
  new MalFunction((name: MalType) => new MalBoolean(name instanceof MalVector))
);

coreEnv.set(
  MalSymbol.get('vector'),
  new MalFunction((...asts: MalType[]) => new MalVector(asts))
);

coreEnv.set(
  MalSymbol.get('sequential?'),
  new MalFunction((name: MalType) => {
    return new MalBoolean(name instanceof MalVector || name instanceof MalList);
  })
);

coreEnv.set(
  MalSymbol.get('map?'),
  new MalFunction((name: MalType) => new MalBoolean(name instanceof MalMap))
);

coreEnv.set(
  MalSymbol.get('hash-map'),
  new MalFunction((...asts: MalType[]) => {
    if (asts.length % 2 != 0) {
      throw 'even numbers';
    }
    return new MalMap(asts);
  })
);

coreEnv.set(
  MalSymbol.get('assoc'),
  new MalFunction((map: MalMap, ...list: MalType[]) => map.assoc(list))
);

coreEnv.set(
  MalSymbol.get('dissoc'),
  new MalFunction((map: MalMap, ...list: MalType[]) => map.dissoc(list))
);

coreEnv.set(
  MalSymbol.get('vals'),
  new MalFunction((map: MalMap) => map.vals())
);

coreEnv.set(
  MalSymbol.get('keys'),
  new MalFunction((map: MalMap) => map.keys())
);

coreEnv.set(
  MalSymbol.get('get'),
  new MalFunction((map: MalMap, key: MalType) => {
    try {
      return map.get(key);
    } catch (error) {
      return MalNil.Instance;
    }
  })
);

coreEnv.set(
  MalSymbol.get('contains?'),
  new MalFunction((map: MalMap, key: MalType) => map.contains(key))
);

coreEnv.set(
  MalSymbol.get('some-fn'),
  new MalFunction((predicate: MalFunction, list: MalList | MalVector) => {
    return list.some(predicate);
  })
);

coreEnv.set(
  MalSymbol.get('every-fn'),
  new MalFunction((predicate: MalFunction, list: MalList | MalVector) => {
    return list.every(predicate);
  })
);

coreEnv.set(
  MalSymbol.get('zero?'),
  new MalFunction((ast: MalType) => {
    try {
      return new MalBoolean((ast as MalNumber).num === 0);
    } catch (error) {
      return new MalBoolean(false);
    }
  })
);

coreEnv.set(
  MalSymbol.get('readline'),
  new MalFunction((ast: MalType) => {
    try {
      const res: string | null = readline((ast as MalString).str);
      if (!res) {
        return MalNil.Instance;
      } else {
        return new MalString(res);
      }
    } catch (error) {
      return MalNil.Instance;
    }
  })
);

coreEnv.set(
  MalSymbol.get('with-meta'),
  new MalFunction((ast: MalType, meta: MalType) => ast.withMeta(meta))
);

coreEnv.set(
  MalSymbol.get('meta'),
  new MalFunction((ast: MalType) => ast.meta || MalNil.Instance)
);

coreEnv.set(
  MalSymbol.get('time-ms'),
  new MalFunction(() => new MalNumber(Date.now()))
);

coreEnv.set(
  MalSymbol.get('macro?'),
  new MalFunction((el: MalType) => {
    return new MalBoolean(el instanceof MalFunction && el.isMacro);
  })
);

coreEnv.set(
  MalSymbol.get('seq'),
  new MalFunction((el: MalList | MalVector | MalString | MalNil) => {
    if (el instanceof MalNil) return MalNil.Instance;
    if (el.isEmpty().value) return MalNil.Instance;
    if (el instanceof MalString)
      return new MalList(el.str.split('').map(e => new MalString(e)));
    if (el instanceof MalVector) return new MalList(el.list);
    return el;
  })
);

coreEnv.set(
  MalSymbol.get('conj'),
  new MalFunction((list: MalType, ...args: MalType[]) => {
    if (list instanceof MalList) {
      const newList: MalList = new MalList(list.list);
      args.forEach((el: MalType) => newList.list.unshift(el));
      return newList;
    }
    if (list instanceof MalVector) {
      return new MalVector([...list.list, ...args]);
    }
    throw new Error(`unexpected symbol: expected: list or vector`);
  })
);

coreEnv.set(MalSymbol.get('*host-language*'), new MalString('typescript'));

export default coreEnv;
