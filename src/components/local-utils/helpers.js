import rawDataType from '../utils/rawDataType';
import CustomError from './custom-error';

export function generateFetchOptions(method, body = {}, token = null) {
  const optionsObj = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) optionsObj.headers['token'] = token;
  if (method !== 'GET' && body) {
    optionsObj['body'] = rawDataType(body) === 'string' ? body : JSON.stringify(body);
  }

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

    const serverResponse = await request.json();

    if (serverResponse?.newToken) {
      swapTokenWith(serverResponse.newToken);
      delete serverResponse.newToken;
    }
    const { response } = serverResponse;

    try {
      const responseObject = JSON.parse(response);
      return responseObject;
    } catch {
      return response;
    }
  } catch (error) {
    console.error(error);

    if (error?.message?.search(/Failed to/i) > -1) {
      throw new CustomError('Server is down', 'ServerConnectionError', 500);
    }

    const errorText = typeof error === 'string' ? error : await error.text();
    console.error(errorText);
    throw new CustomError(errorText, 'ServerResponseError', error?.status);
  }
}

export function convertDollarToFloat(dollar, wholeNum = false) {
  const floatString = dollar.replace('$', '');
  if (wholeNum) return convertToNumber(floatString);
  return parseFloat(floatString);
}

function convertToNumber(floatString) {
  return parseInt(floatString.toString().replace('.', ''));
}

export function serializeOrderCart(cartObject) {
  const cartArray = Object.entries(cartObject);
  return cartArray
    .map(([itemName, { quantity }]) => {
      const itemsToAdd = `${itemName},`.repeat(quantity).trim().split(',');
      itemsToAdd.pop();
      return itemsToAdd;
    })
    .flat();
}

export function getCartCount(cart) {
  return Object.entries(cart).reduce((total, cartItem) => {
    const {
      1: { quantity },
    } = cartItem;
    return (total += quantity);
  }, 0);
}

export function getTotal(cart) {
  return Object.entries(cart).reduce((total, cartItem) => {
    const {
      1: { quantity, initialPrice },
    } = cartItem;
    const totalValue = quantity * initialPrice;
    return (total += totalValue);
  }, 0);
}
