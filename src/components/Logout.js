import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { cartState as cartStateAtom } from './atoms';
import {
  generateFetchOptions,
  generateUrl,
  fetchWrapper,
  removeCart,
  saveOrder,
} from './local-utils/helpers';

const LogoutButton = styled.button`
  padding: 0.8em;
  border-radius: 7px;
  border: none;
  font-size: 1em;
  cursor: pointer;
  font-family: var(--primaryFont);
  font-weight: var(--xBold);
  background: ${({ theme }) => theme.backgroundLighter};
  color: ${({ theme }) => theme.accentColor};
  border: 5px double ${({ theme }) => theme.accentColor};
  transition: scale 0.3s ease, background 0.3s ease, color 0.3s ease;

  &:focus,
  &:focus-within,
  &:hover {
    background: ${({ theme }) => theme.accentColor};
    color: ${({ theme }) => theme.backgroundLighter};
  }

  &:active {
    scale: 0.95;
  }
`;

export default function Logout({ logUserOut }) {
  const history = useHistory();
  const updateCart = useSetRecoilState(cartStateAtom);

  const logout = async () => {
    const { email, Id: tokenId } = JSON.parse(localStorage.getItem('currentAccessToken'));
    const orders = JSON.parse(localStorage.getItem('storedCart')) || null;

    if (orders) await saveOrder(email, orders, tokenId);

    await fetchWrapper(
      generateUrl(`/tokens?email=${email}`),
      generateFetchOptions('DELETE', null, tokenId)
    );

    localStorage.removeItem('currentAccessToken');
    removeCart();
    updateCart({});

    logUserOut();
    toast('Bye 👋! Come back soon', { type: 'success' });

    history.push('/');
  };

  return (
    <LogoutButton data-testid="logout-button" onClick={logout}>
      Logout
    </LogoutButton>
  );
}
