import React from 'react';
import styled from 'styled-components';
import Loading from './Loading';
import hexToRgb from './utils/hexToRgb';

import { toast } from 'react-toastify';
import { UserSessionContext } from './context/context';
import { ReactComponent as SettingsSvg } from '../assets/settings.svg';
import { UpdatePasswordForm, UpdateProfileForm } from './Forms';
import { m as motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';
import { settingsFormTextVariants, defaultPageTransitionVariants } from './utils/framer-variants';
import { generateUrl, fetchWrapper, generateFetchOptions } from './utils/helpers';

const SettingsSection = styled(motion.section).attrs({
  className: 'section-container',
  variants: defaultPageTransitionVariants,
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
})`
  display: flex;
  align-items: center;

  svg {
    transform: scale(0.85);

    @media (max-width: 1000px) {
      display: none;
    }
  }

  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-basis: 70%;
    height: 100%;
    position: relative;
    color: ${({ theme }) => theme.baseColor};

    h1 {
      width: calc(0.85 * 90%);
      text-align: center;
      font-size: clamp(2rem, 9vmin, 3rem);
      margin: 0 0 0.6em 0;
      color: ${({ theme }) => hexToRgb(theme.baseColor, 0.8)};
      font-family: var(--primaryFont);
      font-weight: var(--xBold);
    }

    @media (max-width: 1000px) {
      height: 100%;
      width: 90%;
      flex-basis: unset;
      margin: 0 auto;
    }

    @media (max-width: 650px) {
      width: 95%;
    }

    @media (orientation: landscape) and (max-width: 850px) {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  @media (orientation: landscape) and (max-width: 850px) {
    &.section-container {
      display: block;
    }
  }
`;

export default function Settings() {
  const {
    userData: { email },
  } = React.useContext(UserSessionContext);

  const formStates = ['Update your profile', 'Change password'];
  const [isLoading, setIsLoading] = React.useState(false);
  const [formStateIndex, setFormStateIndex] = React.useState(0);

  const { current: endpoint } = React.useRef(generateUrl(`users?email=${email}`));

  const toggleFormState = () => {
    setFormStateIndex(index => (index < formStates.length - 1 ? index + 1 : 0));
  };

  const saveChanges = async (url, data) => {
    try {
      setIsLoading(true);
      const { Id: tokenId } = JSON.parse(localStorage.getItem('currentAccessToken'));

      await fetchWrapper(url, generateFetchOptions('PUT', data, tokenId));
      const toastOptions = { type: 'success', autoClose: 3000 };

      !formStateIndex
        ? toast('Profile updated', toastOptions)
        : toast('Password updated successfully', toastOptions);
    } catch (error) {
      toast('An error occurred updating your account', { type: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const memoizedSaveChangesHandler = React.useCallback(saveChanges.bind(null, endpoint), [
    formStateIndex,
  ]);

  return (
    <SettingsSection>
      <SettingsSvg />

      <div className="form-container">
        <AnimateSharedLayout>
          <motion.h1 variants={settingsFormTextVariants} layout="position" key={formStateIndex}>
            {formStates[formStateIndex]}
          </motion.h1>

          <AnimatePresence>
            {isLoading && <Loading layoutId="settings-form" key="loader" />}
          </AnimatePresence>

          {formStateIndex === 0 ? (
            <UpdateProfileForm saveChanges={memoizedSaveChangesHandler} isLoading={isLoading} />
          ) : (
            <UpdatePasswordForm saveChanges={memoizedSaveChangesHandler} />
          )}

          <motion.p
            className="form-state-switch-text"
            variants={settingsFormTextVariants}
            onClick={toggleFormState}
            key={formStateIndex ^ 1}>
            {formStates[formStateIndex ^ 1]}
          </motion.p>
        </AnimateSharedLayout>
      </div>
    </SettingsSection>
  );
}

Settings.whyDidYouRender = true;
