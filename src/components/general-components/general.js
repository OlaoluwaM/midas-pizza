import styled from 'styled-components';

import { m as motion } from 'framer-motion';
import { pageVariants } from '../local-utils/framer-variants';

export const PageWrapper = styled(motion.div).attrs({
  className: 'container',
  variants: pageVariants,
  initial: 'hide',
  animate: 'show',
  exit: 'exit',
  key: 'pageWrapper',
})``;
