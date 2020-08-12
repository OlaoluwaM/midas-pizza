import React from 'react';

// Only for cases where data/response needs to be rendered once
export default function useFetch(initialOptions = { url: null, options: null }) {
  const fetchErrorLog = React.useRef(new Set());
  const [fetchOptions, setFetchOptions] = React.useState(initialOptions);

  const [response, setResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState('');

  const refetch = url => {
    const fetchErrorLogArray = [...fetchErrorLog.current];
    let prevFetchOptions;

    if (!url) {
      prevFetchOptions = fetchErrorLogArray[fetchErrorLogArray.length - 1];
    } else {
      prevFetchOptions = [...fetchErrorLog.current].find(({ url: prevUrl }) => prevUrl === url);
    }

    if (!prevFetchOptions) {
      console.log(`Cannot refetch ${url}`);
      return;
    }

    setFetchOptions(prevFetchOptions);
    fetchErrorLog.current.delete(prevFetchOptions);
  };

  React.useEffect(() => {
    (async () => {
      if (!fetchOptions || Object.keys(fetchOptions).length === 0 || !fetchOptions?.url) return;

      const { url, options = {} } = fetchOptions;
      setIsLoading(true);

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        if (!response.ok) throw result;

        setResponse(result);
      } catch (err) {
        fetchErrorLog.current.add(fetchOptions);
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      setResponse(null);
      setFetchOptions({});
      setErrorMessage('');
      setIsLoading(false);
    };
  }, [JSON.stringify(fetchOptions)]);

  return { response, isLoading, errorMessage, setFetchOptions, refetch };
}
