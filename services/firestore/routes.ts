import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { RouteData } from "../../types";
export const fetchRoutesFromFirestore = async (): Promise<RouteData[]> => {
  const routesRef = collection(firestore, "routes");
  const routesSnapshot = await getDocs(routesRef);

  const routesData: RouteData[] = routesSnapshot.docs.map((doc) => ({
    ...doc.data(),
  })) as RouteData[];

  return routesData;
};
