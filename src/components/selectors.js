import { selector } from 'recoil';
import { cartState as cartStateAtom } from './atoms';

export const cartCount = selector({
  key: 'cartCount',
  get: ({ get }) => {
    const cartStateObject = get(cartStateAtom);
    const valueArray = Object.values(cartStateObject);
    const count = valueArray.reduce((total, curr) => (total += curr), 0);

    return count;
  },
});
