class MalList {
  public readonly list: MalType[];
  constructor(list: MalType[]) {
    this.list = list;
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    const strings: string[] = this.list.map((mal: MalType) => mal.toString());
    return `(${strings.join(' ')})`;
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
}

class MalVector {
  public readonly list: MalType[];
  constructor(list: MalType[]) {
    this.list = list;
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    const strings: string[] = this.list.map((mal: MalType) => mal.toString());
    return `[${strings.join(' ')}]`;
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
}

class MalMap {
  public readonly list: MalType[];
  constructor(list: MalType[]) {
    this.list = list;
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    const strings: string[] = this.list.map((mal: MalType) => mal.toString());
    return `{${strings.join(' ')}}`;
  }

  public equals(other: MalMap): MalBoolean {
    if (this.list.length !== other.list.length) return new MalBoolean(false);
    let isEqual: boolean = true;
    for (let index = 0; index < this.list.length; index++) {
      //@ts-ignore
      isEqual = isEqual && this.list[index].equals(other.list[index]).value;
    }
    return new MalBoolean(isEqual);
  }
}

class MalNumber {
  public readonly num: number;
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
}

class MalString {
  private str: string;
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
    return `"${this.str.toString()}"`;
  }

  public equals(other: MalString): MalBoolean {
    return new MalBoolean(this.str === other.str);
  }
}

class MalSymbol {
  public readonly sym: string;
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
}

class MalNil {
  private static _instance: MalNil;

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
}

class MalBoolean {
  public readonly value: boolean;

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
}

class MalKeyword {
  private keyword: string;
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
}

type MalF = (...args: (MalType | undefined)[]) => MalType;

class MalFunction {
  private fn: MalF;

  constructor(fn: MalF) {
    this.fn = fn;
  }

  public apply(params: MalType[]): MalType {
    return this.fn(...params);
  }

  //@ts-ignore
  public toString(printReadably = true): string {
    return '#<function>';
  }

  public equals(other: MalFunction) {
    return new MalBoolean(this === other);
  }
}

type MalType =
  | MalMap
  | MalNil
  | MalList
  | MalNumber
  | MalString
  | MalVector
  | MalSymbol
  | MalKeyword
  | MalBoolean
  | MalFunction;

export {
  MalF,
  MalMap,
  MalNil,
  MalType,
  MalList,
  MalNumber,
  MalString,
  MalVector,
  MalSymbol,
  MalKeyword,
  MalBoolean,
  MalFunction
};
