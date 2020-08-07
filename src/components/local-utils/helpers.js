export function generateFetchOptions(method, body = {}, token = null) {
  const optionsObj = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
  if (token) optionsObj['token'] = token;

  return optionsObj;
}
