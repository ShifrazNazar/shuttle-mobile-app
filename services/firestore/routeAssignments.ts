import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { RouteAssignment } from "../../types";

export const fetchRouteAssignmentsFromFirestore = async (): Promise<
  RouteAssignment[]
> => {
  const assignmentsRef = collection(firestore, "routeAssignments");
  const assignmentsQuery = query(
    assignmentsRef,
    where("status", "==", "active")
  );

  const assignmentsSnapshot = await getDocs(assignmentsQuery);

  const assignments: RouteAssignment[] = assignmentsSnapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data(),
    })
  ) as RouteAssignment[];

  return assignments;
};

export const fetchRouteAssignmentsByDriver = async (
  driverId: string
): Promise<RouteAssignment[]> => {
  const assignmentsRef = collection(firestore, "routeAssignments");
  const assignmentsQuery = query(
    assignmentsRef,
    where("driverId", "==", driverId),
    where("status", "==", "active")
  );

  const assignmentsSnapshot = await getDocs(assignmentsQuery);

  const assignments: RouteAssignment[] = assignmentsSnapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data(),
    })
  ) as RouteAssignment[];

  return assignments;
};

export const subscribeToRouteAssignments = (
  callback: (assignments: RouteAssignment[]) => void,
  onError?: (error: Error) => void
) => {
  const assignmentsRef = collection(firestore, "routeAssignments");
  const assignmentsQuery = query(
    assignmentsRef,
    where("status", "==", "active")
  );

  return onSnapshot(
    assignmentsQuery,
    (snapshot) => {
      const assignments: RouteAssignment[] = [];
      snapshot.forEach((doc) => {
        assignments.push({
          id: doc.id,
          ...doc.data(),
        } as RouteAssignment);
      });
      callback(assignments);
    },
    (error) => {
      console.error("Error listening to route assignments:", error);
      onError?.(error);
    }
  );
};

export const subscribeToDriverRouteAssignments = (
  driverId: string,
  callback: (assignments: RouteAssignment[]) => void,
  onError?: (error: Error) => void
) => {
  const assignmentsRef = collection(firestore, "routeAssignments");
  const assignmentsQuery = query(
    assignmentsRef,
    where("driverId", "==", driverId),
    where("status", "==", "active")
  );

  return onSnapshot(
    assignmentsQuery,
    (snapshot) => {
      const assignments: RouteAssignment[] = [];
      snapshot.forEach((doc) => {
        assignments.push({
          id: doc.id,
          ...doc.data(),
        } as RouteAssignment);
      });
      callback(assignments);
    },
    (error) => {
      console.error("Error listening to driver route assignments:", error);
      onError?.(error);
    }
  );
};
