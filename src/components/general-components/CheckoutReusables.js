import styled from 'styled-components';

import { m as motion } from 'framer-motion';
import {
  simpleAnimationCheckoutVariants,
  checkoutStatusContainerVariants,
} from '../utils/framer-variants';

export const CheckoutStateContainer = styled(motion.div).attrs({
  variants: checkoutStatusContainerVariants,
  animate: 'popOut',
  exit: 'exit',
  layout: true,
})``;

export const SimpleAnimationContainer = styled(motion.div).attrs({
  variants: simpleAnimationCheckoutVariants,
})``;
