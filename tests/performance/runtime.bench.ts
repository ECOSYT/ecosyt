import { bench, describe } from 'vitest';

describe('runtime', () => {
  bench('noop', () => {
    return 1 + 1;
  });
});
