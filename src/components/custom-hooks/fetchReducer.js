export function fetchReducerInit() {
  return {
    error: null,
    isLoading: false,
  };
}

export default function fetchReducer(state, action) {
  switch (action.type) {
    case 'Success':
      return {
        error: null,
        isLoading: false,
      };
    case 'Pending':
      return {
        ...state,
        isLoading: true,
      };
    case 'Error':
      return {
        error: action.error,
        isLoading: false,
      };
    case 'Reset':
      return fetchReducerInit();

    default:
      throw new Error(`${action.type} is not valid`);
  }
}
