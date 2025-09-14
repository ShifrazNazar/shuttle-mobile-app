import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { LocationData } from "../../types";

export const fetchLocationsFromFirestore = async (): Promise<
  LocationData[]
> => {
  const locationsRef = collection(firestore, "locations");
  const locationsSnapshot = await getDocs(locationsRef);

  const locationsData: LocationData[] = locationsSnapshot.docs.map((doc) => ({
    ...doc.data(),
  })) as LocationData[];

  return locationsData;
};
