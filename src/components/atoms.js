import { atom } from 'recoil';

export const cartState = atom({
  key: 'cartState',
  default: [],
});
export const showCart = atom({
  key: 'showCart',
  default: false,
});
