import { atom } from 'recoil';

const defaultCartObject = Object.defineProperty({}, 'totalCount', {
  enumerable: false,
  value: 0,
  writable: true,
});

export const cartState = atom({
  key: 'cartState',
  default: defaultCartObject,
});
