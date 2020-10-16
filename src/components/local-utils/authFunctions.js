const passwordPatterRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}/);

export const validationOptions = {
  passwordLogin: {
    required: 'Please provide your password.',
  },

  passwordSignIn: {
    required: 'Please provide a password.',
    minLength: {
      value: 8,
      message: 'Your password must be at least 8 characters long.',
    },
    pattern: {
      value: passwordPatterRegex,
      message:
        'Password should be alphanumeric a combination of special characters and uppercase letters',
    },
  },

  confirmPassword: {
    required: 'Please confirm your password.',
  },

  email: {
    required: 'Please provide your email.',
  },

  name: {
    required: 'Please provide a username.',
    minLength: {
      value: 5,
      message: 'Your username must be at least 5 characters long.',
    },
  },

  streetAddress: {
    required: 'Please provide your street address',
  },
};

export function handleInvalidInput(error) {
  if (error?.search(/password/) > -1) {
    return { field: 'password', message: 'Password was incorrect' };
  } else if (error?.search(/(may|does) not exist/) > -1) {
    return { field: 'email', message: 'Email did not belong to any user' };
  } else if (error?.search(/already exist/) > -1) {
    const message = 'Email entered belonged to another user, please provide another email';
    return { field: 'email', message };
  } else if (error?.search(/confirmPassword/) > -1) {
    return { field: 'confirmPassword', message: 'Passwords do not match' };
  } else {
    return { field: void 0, message: void 0 };
  }
}
