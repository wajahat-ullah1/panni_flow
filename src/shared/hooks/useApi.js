import { useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// useApi
// A reusable hook that wraps any API call with loading / error / data state.
//
// Usage:
//   const { data, loading, error, execute } = useApi(customerApi.getOrders);
//   useEffect(() => { execute(); }, []);
//
// With arguments:
//   const { execute } = useApi(customerApi.placeOrder);
//   execute({ productId, quantity });
// ─────────────────────────────────────────────────────────────────────────────

export default function useApi(apiFunc) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;           // also return so caller can await it
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || "Something went wrong";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  // Helper to manually clear state (e.g. after closing a modal)
  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
}


// ─────────────────────────────────────────────────────────────────────────────
// useApiOnMount
// Same as useApi but fires automatically when the component mounts.
//
// Usage:
//   const { data: orders, loading, error } = useApiOnMount(customerApi.getOrders);
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";

export function useApiOnMount(apiFunc, ...args) {
  const { data, loading, error, execute, reset } = useApi(apiFunc);

  useEffect(() => {
    execute(...args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, reset };
}
