import { useEffect, useState } from "react";
import { 
  fetchRouteAssignmentsByDriver, 
  subscribeToDriverRouteAssignments 
} from "../services/firestore/routeAssignments";
import { RouteAssignment } from "../types";

export const useDriverRouteAssignments = (driverId: string) => {
  const [assignments, setAssignments] = useState<RouteAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!driverId) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToDriverRouteAssignments(
      driverId,
      (assignmentsData) => {
        setAssignments(assignmentsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error listening to driver route assignments:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [driverId]);

  const refetch = async () => {
    if (!driverId) return;
    
    try {
      setLoading(true);
      setError(null);
      const assignmentsData = await fetchRouteAssignmentsByDriver(driverId);
      setAssignments(assignmentsData);
    } catch (err) {
      console.error("Error refetching driver route assignments:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch driver route assignments");
    } finally {
      setLoading(false);
    }
  };

  return {
    assignments,
    loading,
    error,
    refetch,
  };
};
