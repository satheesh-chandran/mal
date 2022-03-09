import { MalSymbol, MalType } from './types';

class Env {
  private outer: Env | null;
  private data: Map<MalSymbol, MalType>;

  constructor(outer: Env | null) {
    this.outer = outer;
    this.data = new Map<MalSymbol, MalType>();
  }

  public set(key: MalSymbol, value: MalType): MalType {
    this.data.set(key, value);
    return value;
  }

  public find(key: MalSymbol): Env | undefined {
    if (this.data.has(key)) return this;
    if (this.outer) return this.outer.find(key);
    return void 0;
  }

  public get(key: MalSymbol): MalType {
    const errorMessage: string = `'${key.sym}' not found`;

    const env: Env | undefined = this.find(key);
    if (!env) throw new Error(errorMessage);

    const value: MalType | undefined = env.data.get(key);
    if (!value) throw new Error(errorMessage);

    return value;
  }
}

export { Env };
