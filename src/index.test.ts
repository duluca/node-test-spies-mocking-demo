import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import axios from 'axios';
import fs from 'fs/promises';

describe('Mocking modules', () => {
  mock.method(fs, 'readFile', async () => 'test');

  describe('External modules', () => {
    it('should return mocked value for external module', async () => {
      const value = 'test';

      mock.method(axios, 'get', async () => ({ data: value }));

      const result = await axios.get('https://www.google.com');

      assert.equal(result.data, value);
    });
  });

  describe('Native modules', () => {
    it('should return mocked value for native module', async () => {
      const value = 'test';

      const fileContent = await fs.readFile('index.md');

      assert.equal(fileContent, value);
    });
  });
});
