import { useEffect, useState } from "react";
import {
  fetchRouteAssignmentsFromFirestore,
  subscribeToRouteAssignments,
} from "../services/firestore/routeAssignments";
import { RouteAssignment } from "../types";

export const useRouteAssignments = () => {
  const [assignments, setAssignments] = useState<RouteAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToRouteAssignments(
      (assignmentsData) => {
        setAssignments(assignmentsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error listening to route assignments:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const assignmentsData = await fetchRouteAssignmentsFromFirestore();
      setAssignments(assignmentsData);
    } catch (err) {
      console.error("Error refetching route assignments:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch route assignments"
      );
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
