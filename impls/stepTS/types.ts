class MalList {
  private list: MalType[];
  constructor(list: MalType[]) {
    this.list = list;
  }

  public toString(): string {
    const strings: string[] = this.list.map((mal: MalType) => mal.toString());
    return `(${strings.join(' ')})`;
  }
}

class MalVector {
  private list: MalType[];
  constructor(list: MalType[]) {
    this.list = list;
  }

  public toString(): string {
    const strings: string[] = this.list.map((mal: MalType) => mal.toString());
    return `[${strings.join(' ')}]`;
  }
}

class MalMap {
  private list: MalType[];
  constructor(list: MalType[]) {
    this.list = list;
  }

  public toString(): string {
    const strings: string[] = this.list.map((mal: MalType) => mal.toString());
    return `{${strings.join(' ')}}`;
  }
}

class MalNumber {
  private num: number;
  constructor(num: number) {
    this.num = num;
  }

  public toString(): string {
    return this.num.toString();
  }
}

class MalString {
  private str: string;
  constructor(str: string) {
    this.str = str;
  }

  public toString(): string {
    return `"${this.str.toString()}"`;
  }
}

class MalSymbol {
  private sym: string;
  private static symbolMap: Map<string, MalSymbol> = new Map<
    string,
    MalSymbol
  >();

  private constructor(sym: string) {
    this.sym = sym;
  }

  public toString(): string {
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

  public toString(): string {
    return 'nil';
  }
}

class MalBoolean {
  private value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }

  public toString(): string {
    return `${this.value}`;
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

  public toString(): string {
    return `:${this.keyword}`;
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
  | MalBoolean;

export {
  MalMap,
  MalNil,
  MalType,
  MalList,
  MalNumber,
  MalString,
  MalVector,
  MalSymbol,
  MalKeyword,
  MalBoolean
};
