import { useState, useCallback } from "react";

export function useOptimistic<T>(
  initialState: T,
  updateFn: (state: T, newValue: T) => T
) {
  const [state, setState] = useState<T>(initialState);

  const updateOptimistic = useCallback(
    async (newValue: T, asyncUpdate: () => Promise<void>) => {
      const previousState = state;
      
      // Optimistically update
      setState(updateFn(state, newValue));
      
      try {
        await asyncUpdate();
      } catch (error) {
        // Rollback on error
        setState(previousState);
        throw error;
      }
    },
    [state, updateFn]
  );

  return [state, updateOptimistic, setState] as const;
}