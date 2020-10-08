import hexToRgb from '../utils/hexToRgb';
import { themeObj as theme } from '../context/context';

class Variants {
  constructor(showVariants, hideVariants, exitVariants = null, exitInheritHide = true) {
    this.show = showVariants;
    this.hide = hideVariants;
    if (exitVariants || exitInheritHide) {
      this.exit = exitInheritHide && !exitVariants ? hideVariants : exitVariants;
    }
  }
}

export const defaultPageTransitionVariants = new Variants(
  {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerDirection: -1, staggerChildren: 0.3 },
  },
  {
    opacity: 0,
    transition: { when: 'afterChildren', delayChildren: 0.2, staggerChildren: 0.3 },
  }
);

export const defaultPageTransitionVariants2 = {
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.2 },
  },

  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.1,
      delayChildren: 0.4,
    },
  },
};

export const homeVariants = {
  contentVariants: new Variants(
    {
      opacity: 1,
      y: 0,
      transition: { type: 'tween', duration: 0.2 },
    },
    {
      opacity: 0,
      y: 50,
    },
    { opacity: 0, y: 0 }
  ),

  artVariants: new Variants(
    {
      opacity: 1,
      x: 0,
    },
    {
      opacity: 0,
      x: 50,
    },
    { opacity: 0, x: 0 }
  ),
};

export const authVariants = {
  formVariants: new Variants(
    {
      opacity: 1,
      transition: { when: 'beforeChildren', staggerChildren: 0.1 },
    },
    {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0.1,
      },
    }
  ),

  generalAuthVariants: new Variants(
    {
      opacity: 1,
      y: 0,
    },
    { opacity: 0, y: 40 },
    { opacity: 0 }
  ),

  errorMessageVariants: new Variants(
    {
      opacity: 1,
      y: 0,
    },
    {
      opacity: 0,
      y: -60,
    },
    { opacity: 0 }
  ),
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
    borderColor: hexToRgb(theme.gray),
  },

  visible: {
    boxShadow: '0px 0px 0px rgba(0,0,0,0.2)',
    color: theme.gray,
    opacity: 0.5,
    fillOpacity: 0.6,
    borderColor: hexToRgb(theme.gray),
    x: 0,
  },

  active: {
    opacity: 1,
    fillOpacity: 1,
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2)',
    color: theme.black,
    borderColor: hexToRgb(theme.backgroundLighter),
    x: 0,
  },

  Infocus: {
    boxShadow: '0px 0px 0px rgba(0,0,0,0.2)',
    color: theme.blackLighter,
    opacity: 0.8,
    fillOpacity: 0.8,
    borderColor: hexToRgb(theme.blackLighter),
    x: 0,
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

export const cartPreviewVariants = {
  ...defaultPageTransitionVariants2,
  visible: {
    ...defaultPageTransitionVariants2.visible,
    transition: {
      ...defaultPageTransitionVariants2.visible.transition,
      staggerChildren: 0.1,
      delay: 0.4,
    },
  },
  exit: {
    opacity: 0,
  },
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
  hide: {
    opacity: 0,
    boxShadow: `0px 0px 0px ${hexToRgb(theme.blackLighter, 0.4)}`,
  },
};
