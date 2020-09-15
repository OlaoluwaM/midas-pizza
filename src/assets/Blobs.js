import React from 'react';
import hexToRgb from '../components/utils/hexToRgb';

import { themeObj } from '../components/context/context';
import { m as motion } from 'framer-motion';

export const Blob1 = ({ motionProps, ...rest }) => {
  return (
    <motion.svg {...motionProps} {...rest} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={hexToRgb('#FF8E3C', 0.2)}
        d="M59.3,-58.9C71.4,-47.1,72.2,-23.5,68.3,-3.9C64.4,15.7,55.8,31.5,43.6,46.5C31.5,61.5,15.7,75.8,-0.7,76.5C-17.1,77.1,-34.1,64.1,-45.9,49.1C-57.6,34.1,-64,17.1,-65.8,-1.7C-67.5,-20.5,-64.6,-41.1,-52.8,-52.9C-41.1,-64.7,-20.5,-67.8,1.5,-69.3C23.5,-70.8,47.1,-70.7,59.3,-58.9Z"
        transform="translate(100 100)"
      />
    </motion.svg>
  );
};

export const Blob2 = ({ motionProps, ...rest }) => {
  return (
    <motion.svg {...motionProps} {...rest} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={hexToRgb('#FF8E3C', 0.1)}
        d="M55.1,-27C68.8,-8.2,75.3,19.6,65,32.2C54.6,44.8,27.3,42.3,5.6,39.1C-16.1,35.9,-32.3,31.9,-39.5,21.1C-46.7,10.3,-44.9,-7.3,-36.9,-22.9C-28.8,-38.5,-14.4,-52,3.2,-53.8C20.7,-55.7,41.5,-45.8,55.1,-27Z"
        transform="translate(100 100)"
      />
    </motion.svg>
  );
};

export const Blob3 = ({ motionProps, ...rest }) => {
  return (
    <motion.svg {...motionProps} {...rest} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={hexToRgb(themeObj.baseColor, 0.1)}
        d="M38.8,22.9C24.7,46.8,-30,47.9,-43.2,24.4C-56.4,1,-28.2,-46.8,-0.9,-47.3C26.4,-47.8,52.9,-1,38.8,22.9Z"
        transform="translate(100 100)"
      />
    </motion.svg>
  );
};

export const Blob4 = ({ motionProps, ...rest }) => {
  return (
    <motion.svg {...motionProps} {...rest} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={hexToRgb(themeObj.baseColor, 0.3)}
        d="M54.6,-34C68.8,-25.8,76.8,-3.2,70.2,12.1C63.6,27.4,42.3,35.5,23.9,41C5.5,46.6,-10,49.7,-22.4,44.5C-34.9,39.3,-44.2,25.8,-49.4,9.5C-54.5,-6.8,-55.4,-25.8,-46.4,-32.9C-37.5,-39.9,-18.8,-34.9,0.7,-35.5C20.2,-36.1,40.5,-42.2,54.6,-34Z"
        transform="translate(100 100)"
      />
    </motion.svg>
  );
};
