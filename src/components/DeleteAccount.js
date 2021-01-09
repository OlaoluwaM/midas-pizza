import React from 'react';
import Modal from './Modal';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { toast } from 'react-toastify';
import { useCycle } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { LogoutButton } from './Logout';
import { useSetRecoilState } from 'recoil';
import { cartState as cartStateAtom } from './atoms';
import {
  generateFetchOptions,
  generateUrl,
  fetchWrapper,
  removeCartFromLocalStorage,
} from './utils/helpers';

const DeleteAccountButton = styled(LogoutButton)`
  background: ${({ theme }) => hexToRgb(theme.error, 0.2)};
  color: ${({ theme }) => theme.error};
  margin: 0.7em 0 0em 0;
  transition: scale 0.3s ease, color 0.3s ease;

  &:focus,
  &:focus-within,
  &:hover {
    background: ${({ theme }) => theme.error};
    color: ${({ theme }) => theme.backgroundLighter};
  }
`;

const WarningHeaderText = styled.h1`
  color: var(--error);
  font-weight: var(--xXBold);
  font-family: var(--primaryFont);
  margin: 0.5em 0 0 0;

  & + p {
    font-weight: var(--medium);
    margin: 2em 0 2em 0;
    color: ${({ theme }) => hexToRgb(theme.blackLighter, 0.5)};
  }
`;

const DeleteAccountFormContainer = styled(motion.div).attrs({
  variants: {
    popOut: { opacity: 1 },
    close: { opacity: 0 },
    exit: { opacity: 0 },
  },
})`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
`;

const DeleteAccountForm = styled.form`
  display: flex;
  align-items: center;

  & > input {
    border-radius: 5px;
    border: 3px solid ${({ theme }) => hexToRgb(theme.gray, 0.3)};
    transition: border-color 0.2s ease;
    flex-basis: 55%;
    font-size: clamp(0.7em, 2vmin, 1em);
    font-weight: var(--bold);
    padding: min(0.8em, 4%);
    margin-right: 5%;

    &::placeholder {
      color: ${({ theme }) => hexToRgb(theme.gray, 0.3)};
    }

    &:focus,
    &:focus-within,
    &:hover {
      border-color: var(--black);
    }
  }

  & > button {
    margin-top: 0;
    transition: filter 0.2s ease;

    &:disabled {
      filter: grayscale(1);
      pointer-events: none;
    }
  }
`;

function DeleteAccountFormComponent({ requiredInput = 'DELETE', deleteAccountHandler }) {
  const [inputValue, setInputValue] = React.useState('');
  const shouldDisableButton = inputValue === requiredInput;

  return (
    <DeleteAccountFormContainer>
      <WarningHeaderText>Warning, this action is irreversible!!</WarningHeaderText>
      <p>
        If you are sure about it please type <b>DELETE</b> in the field below
      </p>
      <DeleteAccountForm>
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="DELETE"
        />
        <DeleteAccountButton disabled={!shouldDisableButton} onClick={deleteAccountHandler}>
          Delete Account
        </DeleteAccountButton>
      </DeleteAccountForm>
    </DeleteAccountFormContainer>
  );
}

export default function DeleteAccount({ logUserOut }) {
  const [modalVisibility, cycleVisibility] = useCycle(false, true);

  const history = useHistory();
  const updateCart = useSetRecoilState(cartStateAtom);

  const deleteAccount = async () => {
    const { email, Id: tokenId } = JSON.parse(localStorage.getItem('currentAccessToken'));

    await fetchWrapper(
      generateUrl(`/users?email=${email}`),
      generateFetchOptions('DELETE', null, tokenId)
    );

    localStorage.removeItem('currentAccessToken');
    sessionStorage.removeItem('menuItemPhotoIds');

    removeCartFromLocalStorage();
    await toast('GoodBye 👏🏾, so sorry to see you go', { type: 'success', autoClose: 7000 });

    updateCart({});
    history.push('/');

    logUserOut();
  };

  return (
    <>
      <DeleteAccountButton data-testid="delete-account-button" onClick={cycleVisibility}>
        Delete Account ⚠
      </DeleteAccountButton>

      {modalVisibility && (
        <Modal className="delete-account-modal-prompt" closeModal={cycleVisibility}>
          <DeleteAccountFormComponent requiredInput="DELETE" deleteAccountHandler={deleteAccount} />
        </Modal>
      )}
    </>
  );
}
