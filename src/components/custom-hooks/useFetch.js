import React from 'react';

export default function useFetch(url, options) {
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const rawResponse = await fetch(url, options);
        const responseData = await rawResponse.json();
        setResponse(responseData);
      } catch (error) {
        setError(error);
      }
    })();
  }, [url, JSON.stringify(options)]);

  return { response, error, isLoading: !error && !response };
}
