import hexToRgb from '../utils/hexToRgb';
import { themeObj as theme } from '../context/context';

export const defaultPageTransitionVariants = {
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerDirection: -1, staggerChildren: 0.2 },
  },

  hidden: {
    opacity: 0,
    transition: { when: 'afterChildren', staggerChildren: 0.2 },
  },

  exit: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
};

export const defaultPageTransitionVariants2 = {
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.1 },
  },

  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.1,
    },
  },

  exit: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
};

export const homeContentVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'tween', duration: 0.2 },
  },
  hidden: {
    opacity: 0,
    y: 50,
  },
  exit: {
    opacity: 0,
    y: 0,
  },
};

export const homeSVGVariants = {
  visible: {
    opacity: 1,
    x: 0,
  },
  hidden: {
    opacity: 0,
    x: 50,
  },
  exit: { opacity: 0, x: 0 },
};

export const authPageGeneralVariants = {
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren' },
  },

  hidden: {
    opacity: 0,
    transition: { when: 'afterChildren' },
  },

  exit: {
    opacity: 0,
    transition: { when: 'afterChildren' },
  },
};

export const generalAuthElementVariants = {
  visible: {
    opacity: 1,
    y: 0,
  },
  hidden: {
    opacity: 0,
    y: 40,
  },
  exit: { opacity: 0 },
};

export const errorMessageVariants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 },
  },
  hidden: {
    opacity: 0,
    x: -20,
  },
  exit: { opacity: 0 },
};

// ! MENU Variants

export const headerVariants = {
  visible: {
    opacity: 1,
    y: 0,
  },
  hidden: {
    opacity: 0,
    y: -30,
  },
};

export const filterButtonVariants = {
  hidden: {
    opacity: 0,
    fillOpacity: 0,
    x: -10,
  },

  visible: {
    boxShadow: '0px 0px 0px rgba(0,0,0,0.2)',
    color: theme.gray,
    opacity: 0.5,
    fillOpacity: 0.6,
    x: 0,
    transition: { delay: 0.2 },
  },

  active: {
    opacity: 1,
    fillOpacity: 1,
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2)',
    color: theme.black,
    x: 0,
  },

  onHover: {
    x: 0,
    color: theme.black,
    opacity: 1,
    fillOpacity: 1,
  },
};

export const menuItemVariants = {
  visible: i => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05 },
  }),

  hidden: {
    opacity: 0,
    x: -10,
  },
  exit: { opacity: 0 },
};

export const orderItemVariants = {
  visible: {
    opacity: 1,
    y: 0,
  },

  hidden: {
    opacity: 0,
    y: 40,
  },

  exit: {
    opacity: 0,
  },
};

export const emptyCartVectorVariants = {
  visible: {
    opacity: 0.8,
  },
  hidden: {
    opacity: 0,
  },
};

export const checkoutButtonVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 1 },
  },
  hidden: {
    opacity: 0,
    y: 10,
  },
};

export const modalBackgroundVariants = {
  popOut: {
    opacity: 1,
    background: hexToRgb(theme.black, 0.8),
    transition: { ...defaultPageTransitionVariants2.visible.transition },
  },
  close: {
    opacity: 0,
    background: hexToRgb(theme.black, 0),
    transition: { ...defaultPageTransitionVariants2.hidden.transition },
  },
  exit: {
    opacity: 0,
    background: hexToRgb(theme.black, 0),
    transition: { ...defaultPageTransitionVariants2.hidden.transition },
  },
};

export const modalVariants = {
  popOut: {
    y: 0,
    opacity: 1,
    transition: { ...defaultPageTransitionVariants2.visible.transition },
  },
  close: {
    opacity: 0,
    y: 50,
    transition: { ...defaultPageTransitionVariants2.hidden.transition },
  },
  exit: {
    opacity: 0,
    transition: { ...defaultPageTransitionVariants2.hidden.transition },
  },
};

export const settingsMenuTooltipVariants = {
  popUp: {
    opacity: 1,
    boxShadow: `7px 7px 1px ${hexToRgb(theme.blackLighter, 0.4)}`,
    transition: { type: 'spring' },
  },

  hidden: {
    opacity: 0,
    boxShadow: `0px 0px 0px ${hexToRgb(theme.blackLighter, 0.4)}`,
  },
};

export const settingsFormVariants = {
  visible: {
    y: 0,
    opacity: 1,
  },

  hidden: {
    opacity: 0,
    y: 30,
  },
};

export const settingsFormTextVariants = {
  visible: {
    opacity: 1,
    y: 0,
  },

  hidden: {
    opacity: 0,
    y: 30,
  },
  exit: {
    opacity: 0,
  },
};
