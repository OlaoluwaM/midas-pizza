class Variants {
  constructor(showVariants, hideVariants, exitVariants = null, exitInheritHide = true) {
    this.show = showVariants;
    this.hide = hideVariants;
    if (exitVariants || exitInheritHide) {
      this.exit = exitInheritHide && !exitVariants ? hideVariants : exitVariants;
    }
  }
}

export const pageVariants = new Variants(
  {
    opacity: 1,
    transition: { when: 'beforeChildren', delayChildren: 0.2, staggerChildren: 0.3 },
  },
  {
    opacity: 0,
    transition: { when: 'afterChildren', staggerDirection: -1, staggerChildren: 0.3 },
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
      transition: { when: 'beforeChildren', delayChildren: 0.2, staggerChildren: 0.1 },
    },
    {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        delayChildren: 0.2,
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    }
  ),

  generalAuthVariants: new Variants(
    {
      opacity: 1,
      y: 0,
    },
    { opacity: 0, y: 40 }
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
