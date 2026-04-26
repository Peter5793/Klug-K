import { useCallback, useEffect, useState } from "react";

import { useAuth } from "./auth";
import { authenticatedFetchJson } from "./api";

type ApiState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useApiResource<T>(path: string): ApiState<T> {
  const { restaurantId, session } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!session?.access_token) {
      setError("No authenticated session is available.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextData = await authenticatedFetchJson<T>(path, {
        accessToken: session.access_token,
        restaurantId,
      });
      setData(nextData);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to load data.");
    } finally {
      setIsLoading(false);
    }
  }, [path, restaurantId, session?.access_token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh };
}
