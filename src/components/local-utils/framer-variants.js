export const pageVariants = {
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', delay: 0.2, delayChildren: 0.2, staggerChildren: 0.3 },
  },
  hidden: {
    opacity: 0,
    transition: { when: 'afterChildren', staggerDirection: -1, staggerChildren: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { when: 'afterChildren', staggerDirection: -1, staggerChildren: 0.3 },
  },
};

export const homeVariants = {
  contentVariants: {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'tween', duration: 0.2 },
    },
    hidden: {
      opacity: 0,
      y: 50,
    },
    exit: { opacity: 0, y: 0 },
  },

  artVariants: {
    visible: {
      opacity: 1,
      x: 0,
    },
    hidden: {
      opacity: 0,
      x: 50,
    },
    exit: { opacity: 0, x: 0 },
  },
};
