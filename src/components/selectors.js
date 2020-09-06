import { selector } from 'recoil';
import { cartState as cartStateAtom } from './atoms';

export const cartCount = selector({
  key: 'cartCount',
  get: ({ get }) => {
    const cartStateArray = get(cartStateAtom);
    return cartStateArray.length;
  },
});

export const cartObject = selector({
  key: 'cartObject',
  get: ({ get }) => {
    const cartStateArray = get(cartStateAtom);

    return cartStateArray.reduce((cartObj, cartItem) => {
      const alreadyInObject = cartItem in cartObj;
      cartObj[cartItem] = alreadyInObject ? (cartObj[cartItem] += 1) : 1;
      return cartObj;
    }, {});
  },
});
