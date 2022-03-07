import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const READ = (str: String) => str;
const EVAL = (str: String) => str;
const PRINT = (str: String) => str;

const rep = (str: String) => PRINT(EVAL(READ(str)));

const loop = function () {
  rl.question('user> ', (answer: String) => {
    console.log(rep(answer));
    loop();
  });
};

loop();
