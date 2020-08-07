const passwordPatterRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}/);

export const validationOptions = {
  password(isLogin) {
    if (isLogin) return { required: 'Please provide your password.' };

    const formatMessage = `Password must be alphanumeric and must contain special characters.`;

    return {
      required: 'Please provide a password.',
      minLength: {
        value: 8,
        message: 'Your password must be at least 8 characters long.',
      },
      pattern: {
        value: passwordPatterRegex,
        message: formatMessage,
      },
    };
  },

  confirmPassword(passwordValue) {
    console.log({ passwordValue });
    return {
      required: 'Please confirm your password.',
      validate: value => value === passwordValue || 'Passwords do not match',
    };
  },

  email() {
    return {
      required: 'Please provide your email.',
    };
  },

  name(isLogin) {
    if (!isLogin) {
      return {
        required: 'Please provide a username.',
        minLength: {
          value: 5,
          message: 'Your username must be at least 5 characters long.',
        },
      };
    }

    return { required: 'Please provide your username.' };
  },

  streetAddress() {
    return { required: 'Please provide your street address' };
  },
};
