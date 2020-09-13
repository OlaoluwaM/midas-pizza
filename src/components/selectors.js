import { selector } from 'recoil';
import { cartState as cartStateAtom } from './atoms';
import { getCartCount } from './local-utils/helpers';

export const cartCount = selector({
  key: 'cartCount',
  get: ({ get }) => {
    const cartStateObject = get(cartStateAtom);
    return getCartCount(cartStateObject);
  },
});
