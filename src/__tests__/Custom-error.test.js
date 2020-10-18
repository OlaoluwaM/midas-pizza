const testMessage = 'Random Error';

test('Should create appropriate error based on type', () => {
  const errorObject = new CustomError(testMessage, 400);
  expect(errorObject).toBeInstanceOf(CustomError);
  expect(errorObject).toHaveProperty('message', testMessage);
  expect(errorObject).toHaveProperty('status', 400);
});

test('Invalid error type should throw a TypeError', () => {
  const invalidError = () => {
    new CustomError(testMessage, 'NewInvalidErrorType');
  };

  expect(() => invalidError()).toThrowError(TypeError);
});
