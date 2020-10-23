const testMessage = 'Random Error';

test('Should create appropriate error based on type', () => {
  const errorObject = new CustomError(testMessage, undefined, 400);

  expect(errorObject).toBeInstanceOf(CustomError);
  expect(errorObject).toHaveProperty('message', testMessage);
  expect(errorObject).toHaveProperty('status', 400);
  expect(errorObject).toHaveProperty('type', 'CustomError');
});
