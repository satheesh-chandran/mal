import * as ffi from 'ffi-napi';

const RL_LIB = 'libreadline';

const rllib = ffi.Library(RL_LIB, {
  readline: ['string', ['string']]
});

const readline = function (prompt: string): string | null {
  return rllib.readline(prompt);
};

export { readline };
