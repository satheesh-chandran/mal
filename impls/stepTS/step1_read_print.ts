import * as readline from 'readline';
import { print_str } from './printer';
import { read_str } from './reader';
import { MalType } from './types';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const READ = (str: string): MalType => read_str(str);
const EVAL = (ast: MalType): MalType => ast;
const PRINT = (ast: MalType): string => print_str(ast);

const rep = (str: string) => PRINT(EVAL(READ(str)));

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
