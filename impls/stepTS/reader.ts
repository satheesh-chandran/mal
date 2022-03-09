import {
  MalType,
  MalList,
  MalNumber,
  MalString,
  MalSymbol,
  MalNil,
  MalBoolean,
  MalVector,
  MalMap,
  MalKeyword
} from './types';

class Reader {
  private tokens: Array<string>;
  private position: number;

  constructor(tokens: Array<string>) {
    this.tokens = tokens.slice();
    this.position = 0;
  }

  public next(): string {
    const currentToken: string = this.peek();
    this.position++;
    return currentToken;
  }

  public peek(): string {
    return this.tokens[this.position];
  }
}

const read_atom = function (reader: Reader): MalType {
  const token: string = reader.next();
  if (token.match(/^-?[0-9]+$/)) {
    return new MalNumber(parseInt(token, 10));
  }
  if (token.match(/^-?[0-9]\.[0-9]+$/)) {
    return new MalNumber(parseFloat(token));
  }
  if (token.match(/^"(?:\\.|[^\\"])*"$/)) {
    const str: string = token
      .slice(1, token.length - 1)
      .replace(/\\(.)/g, (_, char: string) => (char == 'n' ? '\n' : char));
    return new MalString(str);
  }
  if (token[0] === '"') throw new Error("expected '\"', got EOF");
  if (token[0] === ':') return MalKeyword.get(token.substr(1));
  if (token === 'nil') return MalNil.Instance;
  if (token === 'true') return new MalBoolean(true);
  if (token === 'false') return new MalBoolean(false);
  return MalSymbol.get(token);
};

const read_pattern = (
  reader: Reader,
  dType: { new (list: MalType[]): MalType },
  open: string,
  close: string
): MalType => {
  const currentToken = reader.next();
  if (currentToken !== open) {
    throw new Error(`unexpected token ${currentToken}, expected ${open}`);
  }
  const ast: MalType[] = [];
  let token: string = reader.peek();
  while (token !== close) {
    if (!reader.peek()) {
      throw new Error('unbalanced');
    }
    ast.push(read_form(reader));
    token = reader.peek();
  }
  reader.next();
  return new dType(ast);
};

const read_list = function (reader: Reader): MalType {
  return read_pattern(reader, MalList, '(', ')');
};

const read_vector = function (reader: Reader): MalType {
  return read_pattern(reader, MalVector, '[', ']');
};

const read_hashMap = function (reader: Reader): MalType {
  return read_pattern(reader, MalMap, '{', '}');
};

const read_form = function (reader: Reader): MalType {
  const readSymbol = function (name: string, read: Reader): MalList {
    read.next();
    const sym: MalSymbol = MalSymbol.get(name);
    const target = read_form(read);
    return new MalList([sym, target]);
  };

  const token: string = reader.peek();
  switch (token) {
    case '(':
      return read_list(reader);
    case '[':
      return read_vector(reader);
    case '{':
      return read_hashMap(reader);
    case "'":
      return readSymbol('quote', reader);
    case '`':
      return readSymbol('quasiquote', reader);
    case '~':
      return readSymbol('unquote', reader);
    case '~@':
      return readSymbol('splice-unquote', reader);
    case '@':
      return readSymbol('deref', reader);
  }
  return read_atom(reader);
};

const tokenize = function (str: string): Array<string> {
  const reg: RegExp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  let match;
  const results: string[] = [];
  // @ts-ignore: Object is possibly 'null'.
  while ((match = reg.exec(str)[1]) !== '') {
    if (match[0] != ';') {
      results.push(match);
    }
  }
  return results;
};

const read_str = function (str: string): MalType {
  const tokens: Array<string> = tokenize(str);
  const reader: Reader = new Reader(tokens);
  return read_form(reader);
};

export { read_str };
