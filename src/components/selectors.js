import { selector } from 'recoil';
import { cartState as cartStateAtom } from './atoms';
import { getCartCount } from './local-utils/helpers';

export const cartCount = selector({
  key: 'cartCount',
  get: ({ get }) => {
    const cartStateObject = get(cartStateAtom);
    const orderCount = getCartCount(cartStateObject);

    if (orderCount > 0) {
      localStorage.setItem('storedCart', JSON.stringify(cartStateObject));
    } else localStorage.removeItem('storedCart');

    return orderCount;
  },
});
