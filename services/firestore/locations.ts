import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

export interface LocationData {
  locationId: string;
  name: string;
  fullName: string;
  type:
    | "university"
    | "residential"
    | "transport_hub"
    | "religious"
    | "commercial";
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

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
