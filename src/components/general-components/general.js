import styled from 'styled-components';

import { m as motion } from 'framer-motion';

export const BaseButton = styled(motion.button).attrs({
  layout: 'position',
  whileTap: { scale: 0.9 },
})``;
