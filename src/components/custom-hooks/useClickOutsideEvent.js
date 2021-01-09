import { useEffect, useCallback } from 'react';

export default function useClickOutsideEvent(elementRef, eventHandler) {
  const mouseDownEventHandler = e => {
    if (elementRef && !elementRef.current.contains(e.target)) eventHandler();
    return;
  };

  useEffect(() => {
    document.addEventListener('mousedown', mouseDownEventHandler);

    return () => document.removeEventListener('mousedown', mouseDownEventHandler);
  }, [elementRef]);
}
