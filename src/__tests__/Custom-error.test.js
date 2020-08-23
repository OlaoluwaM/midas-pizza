const testMessage = 'Random Error';

test('Should create appropriate error based on type', () => {
  const errorTypes = ['ValidationError', 'ServerConnectionError', 'ServerResponseError'];

  errorTypes.forEach(type => {
    const errorObject = new CustomError(testMessage, type);

    expect(errorObject).toBeInstanceOf(CustomError);
    expect(errorObject).toHaveProperty('name', type);
    expect(errorObject).toHaveProperty('message', testMessage);
    expect(errorObject).toHaveProperty('status', 400);
  });
});

test('Invalid error type should throw a TypeError', () => {
  const invalidError = () => {
    new CustomError(testMessage, 'NewInvalidErrorType');
  };

  expect(() => invalidError()).toThrowError(TypeError);
});
