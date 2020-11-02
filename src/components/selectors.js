import { selector } from 'recoil';
import { getCartCount } from './utils/helpers';
import { cartState as cartStateAtom } from './atoms';

export const cartCount = selector({
  key: 'cartCount',
  get: ({ get }) => {
    const cartStateObject = get(cartStateAtom);
    const orderCount = getCartCount(cartStateObject);

    localStorage.setItem('storedCart', JSON.stringify(cartStateObject));

    if (orderCount === 0) {
      localStorage.removeItem('storedCart');
      localStorage.removeItem('prevStoredCart');
    }

    return orderCount;
  },
});
