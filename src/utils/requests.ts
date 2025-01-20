import { useRef, useCallback } from "react";

interface UseRequestOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onFinally?: () => void;
}

export function useRequest() {
  const isRequestInProgressRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const executeRequest = useCallback(
    async <T>(
      requestFn: (signal?: AbortSignal) => Promise<T>,
      options?: UseRequestOptions,
    ) => {
      if (isRequestInProgressRef.current) {
        console.log("Request already in progress");
        return;
      }

      try {
        isRequestInProgressRef.current = true;

        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const result = await requestFn(abortControllerRef.current.signal);
        options?.onSuccess?.();
        return result;
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Request canceled");
          return;
        }
        options?.onError?.(error);
        throw error;
      } finally {
        isRequestInProgressRef.current = false;
        abortControllerRef.current = null;
        options?.onFinally?.();
      }
    },
    [],
  );

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isRequestInProgressRef.current = false;
  }, []);

  return {
    executeRequest,
    cancelRequest,
    isRequestInProgress: isRequestInProgressRef.current,
  };
}
