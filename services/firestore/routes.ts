import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

export interface RouteData {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  operatingDays: string[];
  schedule: string[];
  specialNotes?: string;
}
export const fetchRoutesFromFirestore = async (): Promise<RouteData[]> => {
  const routesRef = collection(firestore, "routes");
  const routesSnapshot = await getDocs(routesRef);

  const routesData: RouteData[] = routesSnapshot.docs.map((doc) => ({
    ...doc.data(),
  })) as RouteData[];

  return routesData;
};
