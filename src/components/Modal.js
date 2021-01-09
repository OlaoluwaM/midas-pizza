import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { CloseCircle } from '@styled-icons/evaicons-solid/CloseCircle';
import { m as motion, AnimateSharedLayout } from 'framer-motion';
import { modalBackgroundVariants, modalVariants } from './utils/framer-variants';

const ModalBackground = styled(motion.div).attrs({
  variants: modalBackgroundVariants,
  initial: 'close',
  animate: 'popOut',
  exit: 'exit',
})`
  display: block;
  left: 0;
  top: 0;
  z-index: 8888;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
`;

const ModalContainer = styled(motion.div).attrs({
  variants: modalVariants,
})`
  width: 50%;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.background};
  border-radius: 5px;
  padding: clamp(1em, 3vmin, 2em);
  position: relative;
  z-index: 333;

  & > div {
    overflow: hidden;
    height: fit-content;
  }

  @media (max-width: 780px) {
    div:not(.delete-account-modal-prompt) > &.modal-container {
      width: 75%;
    }
  }

  @media (max-width: 520px) {
    div:not(.delete-account-modal-prompt) > &.modal-container {
      width: 90%;
    }
  }
`;

const ModalCloseBtnSvgContainer = styled(motion.div).attrs({
  whileTap: { scale: 0.8 },
})`
  position: absolute;
  top: clamp(-16px, -14%, -5px);
  right: clamp(-15px, -10%, -4px);

  svg {
    cursor: pointer;
    fill: var(--error);
    width: 3em;
    max-width: 3em;
  }
`;

export default function Modal({ className, children, closeModal }) {
  return (
    <ModalBackground className={`modal, ${className}`} layout>
      <AnimateSharedLayout>
        <ModalContainer data-testid="modal" className="modal-container" layout>
          <ModalCloseBtnSvgContainer className="modal-close-btn-svg-container" layout="position">
            <CloseCircle className="modal-close-btn-svg" onClick={closeModal} />
          </ModalCloseBtnSvgContainer>
          {children}
        </ModalContainer>
      </AnimateSharedLayout>
    </ModalBackground>
  );
}

Modal.whyDidYouRender = true;

Modal.propTypes = {
  className: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
