import { useEffect, useState } from "react";
import { fetchRoutesFromFirestore } from "../services/firestore/routes";
import { RouteData } from "../types";

export const useRoutes = () => {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);
        const routesData = await fetchRoutesFromFirestore();
        setRoutes(routesData);
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch routes");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const routesData = await fetchRoutesFromFirestore();
      setRoutes(routesData);
    } catch (err) {
      console.error("Error refetching routes:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch routes");
    } finally {
      setLoading(false);
    }
  };

  return {
    routes,
    loading,
    error,
    refetch,
  };
};
