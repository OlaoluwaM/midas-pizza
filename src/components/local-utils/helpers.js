import rawDataType from '../utils/rawDataType';

export function generateFetchOptions(method, body = {}, token = null) {
  const optionsObj = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) optionsObj.headers['token'] = token;
  if (method !== 'GET' && body) optionsObj['body'] = JSON.stringify(body);

  return optionsObj;
}

export function generateUrl(resource) {
  return `${process.env.REACT_APP_API_ENDPOINT}${resource}`;
}

function swapTokenWith(tokenObj) {
  if (!tokenObj || Object.keys(tokenObj).length === 0) throw new Error('No token to swap with');

  if (rawDataType(tokenObj) === 'object') {
    localStorage.setItem('currentAccessToken', JSON.stringify(tokenObj));
  } else localStorage.setItem('currentAccessToken', tokenObj);
}

export async function fetchWrapper(url, options) {
  try {
    const request = await fetch(url, options);
    if (!request.ok) throw request;

    const response = await request.json();
    if (response?.newToken) {
      swapTokenWith(response.newToken);
      delete response.newToken;
    }

    return response;
  } catch (error) {
    const errorText = typeof error === 'string' ? error : await error.text();
    console.error(errorText);
    throw errorText;
  }
}
