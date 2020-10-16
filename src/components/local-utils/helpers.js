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
  const { REACT_APP_API_ENDPOINT: URL } = process.env;
  const normalizedUrl = resource.startsWith('/') ? URL.replace('0/', '0') : URL;
  return `${normalizedUrl}${resource}`;
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

    const serverData = await request.json();
    let serverResponse;

    try {
      serverResponse = { ...serverData, response: JSON.parse(serverData.response) };
    } catch {
      serverResponse = { ...serverData };
    }

    const tokenInResponse = serverResponse?.newToken
      ? serverResponse.newToken
      : serverResponse.response.hasOwnProperty('Id')
      ? serverResponse.response
      : '';

    if (tokenInResponse) {
      swapTokenWith(tokenInResponse);
      serverResponse?.newToken && delete serverResponse.newToken;
    }

    if (url.includes('order') && localStorage.getItem('storedCart')) {
      localStorage.setItem('prevStoredCart', localStorage.getItem('storedCart'));
    }

    return serverResponse.response;
  } catch (error) {
    console.error(error);

    const errorText = typeof error === 'string' ? error : await error.text();
    throw new CustomError(errorText, error?.status);
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

export function formatCartFromServer(cart) {
  const formattedCartObject = {};

  for (const orderName in cart) {
    if (orderName === 'orderCount' || orderName === 'totalPrice') continue;
    const { type, quantity, total } = cart[orderName];

    const initialPrice = (total / quantity).toFixed(2);

    formattedCartObject[orderName] = {
      type,
      quantity,
      initialPrice: parseFloat(initialPrice),
    };
  }

  return normalize(formattedCartObject);
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

export function normalize(input) {
  if (input?.length === 0 || Object.keys(input).length === 0 || input === '') {
    return null;
  }
  return input;
}

export function removeCart() {
  localStorage.removeItem('storedCart');
  localStorage.removeItem('prevStoredCart');
}

export async function saveOrder(email, orders, tokenId) {
  await fetchWrapper(
    generateUrl(`order?email=${email}`),
    generateFetchOptions('POST', { orders }, tokenId)
  );
}

export function getErrMessage(errorObj) {
  return propertyName => {
    return errorObj[propertyName]?.message ?? '';
  };
}
