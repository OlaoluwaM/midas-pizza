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

const generalOrchestrationTransition = {
  animate: { when: 'beforeChildren', staggerChildren: 0.2 },
  exit: { when: 'afterChildren', delayChildren: 0.2, staggerChildren: 0.3 },
};

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
export const menuSectionVariants = {
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
