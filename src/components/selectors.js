import { selector } from 'recoil';
import { cartState as cartStateAtom } from './atoms';

export const cartCount = selector({
  key: 'cartCount',
  get: ({ get }) => {
    const cartStateObject = get(cartStateAtom);
    return cartStateObject.totalCount;
  },
});
