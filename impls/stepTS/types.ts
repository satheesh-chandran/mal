import { Env } from './env';

class MalList {
  public readonly list: MalType[];
  public meta?: MalType;

  constructor(list: MalType[]) {
    this.list = list;
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    const strings: string[] = this.list.map((mal: MalType) => mal.toString());
    return `(${strings.join(' ')})`;
  }

  public cons(element: MalType): MalList {
    return new MalList([element, ...this.list]);
  }

  public concat(other: MalList | MalVector): MalList {
    return new MalList(this.list.concat(other.list));
  }

  public beginsWith(name: string): boolean {
    const first: MalType = this.list[0];
    return first instanceof MalSymbol && (first as MalSymbol).sym === name;
  }

  public equals(other: MalList | MalVector): MalBoolean {
    if (this.list.length !== other.list.length) return new MalBoolean(false);

    let isEqual: boolean = true;
    for (let index = 0; index < this.list.length; index++) {
      //@ts-ignore
      isEqual = isEqual && this.list[index].equals(other.list[index]).value;
    }
    return new MalBoolean(isEqual);
  }

  public some(predicate: MalFunction): MalBoolean {
    let result: boolean = false;
    this.list.forEach((el: MalType) => {
      result = result || (predicate.apply([el]) as MalBoolean).value;
    });
    return new MalBoolean(result);
  }

  public every(predicate: MalFunction): MalBoolean {
    let result: boolean = true;
    this.list.forEach((el: MalType) => {
      result = result && (predicate.apply([el]) as MalBoolean).value;
    });
    return new MalBoolean(result);
  }

  public isEmpty(): MalBoolean {
    return new MalBoolean(this.list.length === 0);
  }

  public withMeta(meta: MalType): MalList {
    const newList = new MalList(this.list);
    newList.meta = meta;
    return newList;
  }
}

class MalVector {
  public readonly list: MalType[];
  public meta?: MalType;

  constructor(list: MalType[]) {
    this.list = list;
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    const strings: string[] = this.list.map((mal: MalType) => mal.toString());
    return `[${strings.join(' ')}]`;
  }

  public cons(element: MalType): MalList {
    return new MalList([element, ...this.list]);
  }

  public concat(other: MalList | MalVector): MalList {
    return new MalList(this.list.concat(other.list));
  }

  public beginsWith(name: string): boolean {
    const first: MalType = this.list[0];
    return first instanceof MalSymbol && (first as MalSymbol).sym === name;
  }

  public equals(other: MalVector | MalList): MalBoolean {
    if (this.list.length !== other.list.length) return new MalBoolean(false);

    let isEqual: boolean = true;
    for (let index = 0; index < this.list.length; index++) {
      //@ts-ignore
      isEqual = isEqual && this.list[index].equals(other.list[index]).value;
    }
    return new MalBoolean(isEqual);
  }

  public some(predicate: MalFunction): MalBoolean {
    let result: boolean = false;
    this.list.forEach((el: MalType) => {
      result = result || (predicate.apply([el]) as MalBoolean).value;
    });
    return new MalBoolean(result);
  }

  public every(predicate: MalFunction): MalBoolean {
    let result: boolean = true;
    this.list.forEach((el: MalType) => {
      result = result && (predicate.apply([el]) as MalBoolean).value;
    });
    return new MalBoolean(result);
  }

  public isEmpty(): MalBoolean {
    return new MalBoolean(this.list.length === 0);
  }

  public withMeta(meta: MalType): MalVector {
    const newVector = new MalVector(this.list);
    newVector.meta = meta;
    return newVector;
  }
}

class MalMap {
  public readonly list: Map<MalType, MalType>;
  public meta?: MalType;

  constructor(list: MalType[]) {
    this.list = new Map<MalType, MalType>();
    while (list.length !== 0) {
      const key = list.shift()!;
      const value = list.shift();
      if (!value) {
        throw new Error('unexpected hash length');
      }
      this.list.set(key, value);
    }
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    const mapper = ([key, value]: [MalType, MalType]) => {
      return `${key.toString()} ${value.toString()}`;
    };
    const strings: string[] = this.entries().map(mapper);
    return `{${strings.join(' ')}}`;
  }

  public entries(): [MalType, MalType][] {
    const resultList: [MalType, MalType][] = [];
    this.list.forEach((v, k) => {
      resultList.push([k, v]);
    });
    return resultList;
  }

  public get(otherKey: MalType): MalType {
    const mapEntries: [MalType, MalType][] = this.entries();
    let result: MalType = MalNil.Instance;
    mapEntries.forEach(([key, value]: [MalType, MalType]) => {
      try {
        //@ts-ignore
        if (key.equals(otherKey).value) {
          result = value;
        }
      } catch (error) {}
    });
    return result;
  }

  public contains(k: MalType): MalBoolean {
    let hasKey: boolean = false;
    const myEntries: [MalType, MalType][] = this.entries();
    myEntries.forEach(([key]: [MalType, MalType]) => {
      //@ts-ignore
      hasKey = hasKey || k.equals(key).value;
    });
    return new MalBoolean(hasKey);
  }

  public equals(other: MalMap): MalBoolean {
    if (this.list.size !== other.list.size) return new MalBoolean(false);
    let isEqual: boolean = true;
    const myEntries: [MalType, MalType][] = this.entries();
    myEntries.forEach(([key, value]: [MalType, MalType]) => {
      //@ts-ignore
      isEqual = isEqual && other.get(key).equals(value).value;
    });
    return new MalBoolean(isEqual);
  }

  public vals(): MalList {
    return new MalList(
      this.entries().map(([, val]: [MalType, MalType]) => val)
    );
  }

  public keys(): MalList {
    return new MalList(this.entries().map(([key]: [MalType, MalType]) => key));
  }

  public assoc(list: MalType[]): MalMap {
    const mapEntries: [MalType, MalType][] = this.entries();
    const newEntryList: MalType[] = [];

    for (let index = 0; index < list.length; index++) {
      const key = list.shift();
      const value = list.shift();
      if (!value) {
        throw new Error('unexpected hash length');
      }

      const index = mapEntries.findIndex((el: [MalType, MalType]) => {
        //@ts-ignore
        return el[0].equals(key as MalType).value;
      });
      //@ts-ignore
      newEntryList.push(key);
      //@ts-ignore
      newEntryList.push(value);
      if (index !== -1) {
        mapEntries.splice(index, 1);
      }
    }
    const flatMap: MalType[] = mapEntries.flat();
    return new MalMap([...flatMap, ...newEntryList]);
  }

  public dissoc(list: MalType[]): MalMap {
    const mapEntries: [MalType, MalType][] = this.entries();

    for (let index = 0; index < list.length; index++) {
      const key = list.shift();
      const index = mapEntries.findIndex((el: [MalType, MalType]) => {
        //@ts-ignore
        return el[0].equals(key as MalType).value;
      });

      if (index !== -1) {
        mapEntries.splice(index, 1);
      }
    }

    return new MalMap(mapEntries.flat());
  }

  public withMeta(meta: MalType): MalMap {
    const newMap = new MalMap(this.entries().flat());
    newMap.meta = meta;
    return newMap;
  }
}

class MalNumber {
  public readonly num: number;
  public meta?: MalType;

  constructor(num: number) {
    this.num = num;
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    return this.num.toString();
  }

  public equals(other: MalNumber): MalBoolean {
    return new MalBoolean(this.num === other.num);
  }

  public withMeta(meta: MalType): MalNumber {
    const newNumber = new MalNumber(this.num);
    newNumber.meta = meta;
    return newNumber;
  }
}

class MalString {
  public readonly str: string;
  public meta?: MalType;

  constructor(str: string) {
    this.str = str;
  }

  public toString(printReadably: boolean = true): string {
    if (printReadably) {
      const value: string = this.str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');
      return `"${value}"`;
    }
    return `${this.str.toString()}`;
  }

  public equals(other: MalString): MalBoolean {
    return new MalBoolean(this.str === other.str);
  }

  public isEmpty(): MalBoolean {
    return new MalBoolean(this.str === '');
  }

  public withMeta(meta: MalType): MalString {
    const newString = new MalString(this.str);
    newString.meta = meta;
    return newString;
  }
}

class MalSymbol {
  public readonly sym: string;
  public meta?: MalType;

  private static symbolMap: Map<string, MalSymbol> = new Map<
    string,
    MalSymbol
  >();

  private constructor(sym: string) {
    this.sym = sym;
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    return `${this.sym}`;
  }

  public static get(name: string): MalSymbol {
    let token: MalSymbol | undefined = MalSymbol.symbolMap.get(name);
    if (token) {
      return token;
    }
    token = new MalSymbol(name);
    this.symbolMap.set(name, token);
    return token;
  }

  public equals(other: MalSymbol): MalBoolean {
    return new MalBoolean(this.sym === other.sym);
  }

  public withMeta(meta: MalType): MalSymbol {
    const newSymbol = MalSymbol.get(this.sym);
    newSymbol.meta = meta;
    return newSymbol;
  }
}

class MalNil {
  private static _instance: MalNil;
  public meta?: MalType;

  public static get Instance(): MalNil {
    if (!MalNil._instance) {
      MalNil._instance = new MalNil();
    }
    return MalNil._instance;
  }

  private constructor() {}

  //@ts-ignore
  public toString(printReadably = true): string {
    return 'nil';
  }

  public equals(other: MalNil): MalBoolean {
    return new MalBoolean(this === other);
  }

  public withMeta(meta: MalType): MalNil {
    MalNil.Instance.meta = meta;
    return MalNil.Instance;
  }
}

class MalBoolean {
  public value: boolean;
  public meta?: MalType;

  constructor(value: boolean) {
    this.value = value;
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    return `${this.value}`;
  }

  public equals(other: MalBoolean) {
    return new MalBoolean(this.value === other.value);
  }

  public withMeta(meta: MalType): MalBoolean {
    const newBoolean = new MalBoolean(this.value);
    newBoolean.meta = meta;
    return newBoolean;
  }
}

class MalKeyword {
  private keyword: string;
  public meta?: MalType;

  private static map: Map<string, MalKeyword> = new Map<string, MalKeyword>();

  public static get(name: string): MalKeyword {
    let token: MalKeyword | undefined = MalKeyword.map.get(name);
    if (token) {
      return token;
    }
    token = new MalKeyword(name);
    MalKeyword.map.set(name, token);
    return token;
  }

  private constructor(value: string) {
    this.keyword = value;
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    return `:${this.keyword}`;
  }

  public equals(other: MalKeyword) {
    return new MalBoolean(this.keyword === other.keyword);
  }

  public withMeta(meta: MalType): MalKeyword {
    const newKeyword = new MalKeyword(this.keyword);
    newKeyword.meta = meta;
    return newKeyword;
  }
}

type MalF = (...args: (MalType | undefined)[]) => MalType;

class MalFunction {
  public readonly fn: MalF;
  public readonly ast: MalType | undefined;
  public readonly params: MalSymbol[] | undefined;
  public readonly env: Env | undefined;
  public isMacro: boolean;
  public meta?: MalType;

  constructor(
    fn: MalF,
    ast?: MalType,
    params?: MalSymbol[],
    env?: Env,
    isMacro: boolean = false
  ) {
    this.fn = fn;
    this.ast = ast;
    this.params = params;
    this.env = env;
    this.isMacro = isMacro;
  }

  public apply(params: MalType[]): MalType {
    return this.fn.apply(null, params);
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    return '#<function>';
  }

  public equals(other: MalFunction) {
    return new MalBoolean(this === other);
  }

  public withMeta(meta: MalType): MalFunction {
    const newFun = new MalFunction(
      this.fn,
      this.ast,
      this.params,
      this.env,
      this.isMacro
    );
    newFun.meta = meta;
    return newFun;
  }
}

class MalAtom {
  public ast: MalType;
  public meta?: MalType;

  constructor(ast: MalType) {
    this.ast = ast;
  }

  public toString(): string {
    return `(atom ${this.ast.toString()})`;
  }

  public reset(newAst: MalType): MalType {
    this.ast = newAst;
    return newAst;
  }

  public equals(other: MalAtom): MalBoolean {
    try {
      //@ts-ignore
      return new MalBoolean(this.equals(other).value);
    } catch (error) {
      return new MalBoolean(false);
    }
  }

  public withMeta(meta: MalType): MalAtom {
    const newAtom = new MalAtom(this.ast);
    newAtom.meta = meta;
    return newAtom;
  }
}

class MalException {
  public readonly cause: MalType;
  public meta?: MalType;

  constructor(cause: MalType) {
    this.cause = cause;
  }

  public toString(): string {
    return this.cause.toString();
  }

  public equals(other: MalException): MalBoolean {
    try {
      //@ts-ignore
      return new MalBoolean(this.equals(other).value);
    } catch (error) {
      return new MalBoolean(false);
    }
  }

  public withMeta(meta: MalType): MalException {
    const newError = new MalException(this.cause);
    newError.meta = meta;
    return newError;
  }
}

type MalType =
  | MalMap
  | MalNil
  | MalAtom
  | MalList
  | MalNumber
  | MalString
  | MalVector
  | MalSymbol
  | MalKeyword
  | MalBoolean
  | MalFunction
  | MalException;

export {
  MalF,
  MalMap,
  MalNil,
  MalAtom,
  MalType,
  MalList,
  MalNumber,
  MalString,
  MalVector,
  MalSymbol,
  MalKeyword,
  MalBoolean,
  MalFunction,
  MalException
};
