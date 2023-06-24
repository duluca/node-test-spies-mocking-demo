const assert = require('node:assert/strict');
const { describe, it, mock } = require('node:test');

const calculationService = require('./calculation-service');

const calculateSomething = async (calculationService, a, b) =>
  calculationService.calculate(a, b);

describe('Calculation service', () => {
  it('should return calculated value', async () => {
    const result = await calculationService.calculate();

    assert.strictEqual(result, 5);
  });

  describe('mocking resolved value', () => {
    it('should resolve mocked value', async () => {
      const value = 2;
      mock.method(calculationService, 'calculate', async () => value);

      const result = await calculationService.calculate();

      assert.equal(result, value);
    });

    it('should resolve value by mocked implementation', async () => {
      const value = 2;
      mock.method(calculationService, 'calculate', async (a) => a);

      const result = await calculationService.calculate(value);

      assert.equal(result, value);
    });
  });

  describe('mocking rejected value', () => {
    it('should reject mocked value', async () => {
      const error = new Error('some error message');
      mock.method(calculationService, 'calculate', async () =>
        Promise.reject(error)
      );

      await assert.rejects(
        async () => calculateSomething(calculationService),
        error
      );
    });
  });

  describe('mocking value', () => {
    it('should return mocked value', () => {
      const value = 2;
      mock.method(calculationService, 'calculate', () => value);

      const result = calculationService.calculate();

      assert.equal(result, value);
    });

    it('should return value by mocked implementation', () => {
      const value = 2;
      mock.method(calculationService, 'calculate', (a) => a);

      const result = calculationService.calculate(value);

      assert.equal(result, value);
    });
  });

  describe('mocking chained methods', () => {
    it('should return value from chained methods', async () => {
      const value = 10;
      mock.method(calculationService, 'get', () => calculationService);
      mock.method(calculationService, 'calculate', async () => value);

      const result = await calculationService.get().calculate();

      assert.equal(result, value);
    });
  });

  describe('mocking same method multiple times with different values', () => {
    it('should resolve mocked values', async (context) => {
      const firstValue = 2;
      const secondValue = 3;
      const calculateMock = context.mock.fn(calculationService.calculate);
      calculateMock.mock.mockImplementationOnce(async () => firstValue, 0);
      calculateMock.mock.mockImplementationOnce(async () => secondValue, 1);

      const firstResult = await calculateMock();
      const secondResult = await calculateMock();

      assert.equal(firstResult, firstValue);
      assert.equal(secondResult, secondValue);
    });

    it('should return mocked values', async (context) => {
      const firstValue = 2;
      const secondValue = 3;
      const calculateMock = context.mock.fn(calculationService.calculate);
      calculateMock.mock.mockImplementationOnce(() => firstValue, 0);
      calculateMock.mock.mockImplementationOnce(() => secondValue, 1);

      const firstResult = calculateMock();
      const secondResult = calculateMock();

      assert.equal(firstResult, firstValue);
      assert.equal(secondResult, secondValue);
    });

    it('should return values by mocked implementations', async (context) => {
      const firstValue = 2;
      const secondValue = 3;
      const calculateMock = context.mock.fn(calculationService.calculate);
      calculateMock.mock.mockImplementationOnce((a) => a + firstValue, 0);
      calculateMock.mock.mockImplementationOnce((a) => a + secondValue, 1);

      const firstResult = calculateMock(1);
      const secondResult = calculateMock(1);

      assert.equal(firstResult, firstValue + 1);
      assert.equal(secondResult, secondValue + 1);
    });
  });

  describe('spy calls', () => {
    it('should spy method arguments', async () => {
      const firstValue = 2;
      const secondValue = 3;
      mock.method(calculationService, 'calculate');

      await calculateSomething(calculationService, firstValue, secondValue);

      const call = calculationService.calculate.mock.calls[0];
      assert.deepEqual(call.arguments, [firstValue, secondValue]);
    });

    it('should spy method which is not called', async () => {
      mock.method(calculationService, 'calculate');

      assert.equal(calculationService.calculate.mock.calls.length, 0);
    });

    it('should spy methods arguments for multiple times called methods', async (context) => {
      const firstValue = 0;
      const secondValue = 1;
      const calculateMock = context.mock.fn(calculationService.calculate);
      calculateMock.mock.mockImplementationOnce((a) => a + 2, 0);
      calculateMock.mock.mockImplementationOnce((a) => a + 3, 1);

      calculateMock(firstValue);
      calculateMock(secondValue);

      [firstValue, secondValue].forEach((argument, index) => {
        const call = calculateMock.mock.calls[index];

        assert.deepEqual(call.arguments, [argument]);
      });
    });
  });
});
