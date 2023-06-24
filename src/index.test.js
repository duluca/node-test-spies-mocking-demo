const assert = require('node:assert/strict');
const { describe, it, mock } = require('node:test');

const axios = require('axios');
const fs = require('fs/promises');

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
