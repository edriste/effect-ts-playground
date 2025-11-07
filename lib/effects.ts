import { useEffect, useState, useRef } from "react";
import { Effect, Exit } from "effect";

export function useEffectRun<E, A>(effect: Effect.Effect<A, E, never>) {
  // Track loading, error, and data in a typed way
  const [state, setState] = useState<{ loading: boolean; error?: E; data?: A }>(
    {
      loading: true,
    }
  );
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    // Run the Effect with typed success and failure - no thrown exceptions
    Effect.runPromiseExit(effect).then((exit) => {
      if (!mounted.current) return;

      // Exit ensures both success and failure are handled deterministically
      Exit.match(exit, {
        onSuccess: (value) => setState({ loading: false, data: value }),
        onFailure: (cause) =>
          setState({ loading: false, error: cause as unknown as E }),
      });
    });

    return () => {
      mounted.current = false;
    };
  }, [effect]);

  return state;
}
