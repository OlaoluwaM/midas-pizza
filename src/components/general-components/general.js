import styled from 'styled-components';

import { motion } from 'framer-motion';
import { pageVariants } from '../local-utils/framer-variants';

export const PageWrapper = styled(motion.div).attrs({
  className: 'container',
  variants: pageVariants,
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
})``;
