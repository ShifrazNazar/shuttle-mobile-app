import { useEffect, useState } from "react";
import { fetchLocationsFromFirestore } from "../services/firestore/locations";
import { LocationData } from "../types";

export const useLocations = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        const locationsData = await fetchLocationsFromFirestore();
        setLocations(locationsData);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch locations"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const locationsData = await fetchLocationsFromFirestore();
      setLocations(locationsData);
    } catch (err) {
      console.error("Error refetching locations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch locations"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    locations,
    loading,
    error,
    refetch,
  };
};
