import CustomError from './custom-error';

function rawDataType(value) {
  const _toString = Object.prototype.toString;
  return _toString.call(value).slice(8, -1).toLowerCase();
}

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
  console.log(URL);
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
  let serverData, request;

  try {
    request = await fetch(url, options);
    console.log(request);
    serverData = await request.json();
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
      : false;

    if (tokenInResponse) {
      swapTokenWith(tokenInResponse);
      delete serverResponse.newToken;
    }

    if (!request.ok) throw request;

    if (url.includes('order') && localStorage.getItem('storedCart')) {
      localStorage.setItem('prevStoredCart', localStorage.getItem('storedCart'));
    }

    return serverResponse.response;
  } catch (error) {
    const errorData = serverData?.response ?? error;
    console.error(errorData);

    const errorMessageToThrow =
      rawDataType(errorData) === 'object' ? JSON.stringify(errorData) : errorData;

    throw new CustomError(errorMessageToThrow, void 0, request?.status ?? 418);
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
  if (input && (input?.length === 0 || Object.keys(input).length === 0 || input === '')) {
    return null;
  }
  return input;
}

export function removeCartFromLocalStorage() {
  localStorage.removeItem('storedCart');
  localStorage.removeItem('prevStoredCart');
}

export async function saveOrderToServer(email, orders, tokenId, updateOrder = false) {
  await fetchWrapper(
    generateUrl(`order?email=${email}`),
    generateFetchOptions(updateOrder ? 'PUT' : 'POST', { orders }, tokenId)
  );
}

export function getErrMessage(errorObj) {
  return propertyName => {
    return errorObj[propertyName]?.message ?? '';
  };
}

export function updateLocalStorageAccessToken(email) {
  if (!normalize(email)) return;
  const newAccessToken = { ...JSON.parse(localStorage.getItem('currentAccessToken')), email };
  localStorage.setItem('currentAccessToken', JSON.stringify(newAccessToken));
}

export function formatCurrencyForStripe(float) {
  if (Number.isInteger(float)) return float;
  const floatAsCurrency = parseFloat(float.toFixed(2));
  return floatAsCurrency * 100;
}
