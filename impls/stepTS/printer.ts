import { MalType } from './types';

//@ts-ignore
const print_str = function (element: MalType, printReadably: boolean = true) {
  return element.toString(printReadably);
};

export { print_str };
