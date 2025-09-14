import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";
import {
  BoardingRecord,
  DigitalTravelCard,
  QRCodeData,
} from "../../types/auth";
import * as Crypto from "expo-crypto";

// Re-export types for convenience
export type { DigitalTravelCard, BoardingRecord, QRCodeData };

// Generate a digital signature for QR code validation
const generateSignature = async (
  data: string,
  secret: string
): Promise<string> => {
  // In a real implementation, you'd use a proper HMAC or JWT
  // For demo purposes, we'll create a simple hash
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data + secret
  );
};

// Generate QR code data for student
export const generateQRCodeData = async (
  studentId: string,
  userId: string
): Promise<QRCodeData> => {
  const timestamp = Date.now();
  const dataString = `${studentId}:${userId}:${timestamp}`;
  const secret = process.env.EXPO_PUBLIC_QR_SECRET || "default-secret-key";
  const signature = await generateSignature(dataString, secret);

  return {
    studentId,
    userId,
    timestamp,
    signature,
  };
};

// Create or update digital travel card for student
export const createDigitalTravelCard = async (
  studentId: string,
  userId: string
): Promise<DigitalTravelCard> => {
  try {
    // Check if card already exists
    const cardQuery = query(
      collection(firestore, "digitalTravelCards"),
      where("studentId", "==", studentId),
      where("userId", "==", userId)
    );

    const existingCards = await getDocs(cardQuery);

    if (!existingCards.empty) {
      // Update existing card
      const existingCard = existingCards.docs[0];
      const cardData = existingCard.data() as DigitalTravelCard;

      const qrData = await generateQRCodeData(studentId, userId);
      const qrCode = JSON.stringify(qrData);

      await updateDoc(doc(firestore, "digitalTravelCards", existingCard.id), {
        qrCode,
        lastUsed: serverTimestamp(),
      });

      return {
        ...cardData,
        qrCode,
      };
    } else {
      // Create new card
      const qrData = await generateQRCodeData(studentId, userId);
      const qrCode = JSON.stringify(qrData);

      const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newCard: DigitalTravelCard = {
        cardId,
        studentId,
        userId,
        qrCode,
        isActive: true,
        createdAt: new Date(),
        usageCount: 0,
      };

      await setDoc(doc(firestore, "digitalTravelCards", cardId), {
        ...newCard,
        createdAt: serverTimestamp(),
      });

      return newCard;
    }
  } catch (error) {
    console.error("Error creating digital travel card:", error);
    throw error;
  }
};

// Get digital travel card for student
export const getDigitalTravelCard = async (
  studentId: string,
  userId: string
): Promise<DigitalTravelCard | null> => {
  try {
    const cardQuery = query(
      collection(firestore, "digitalTravelCards"),
      where("studentId", "==", studentId),
      where("userId", "==", userId)
    );

    const cards = await getDocs(cardQuery);

    if (cards.empty) {
      return null;
    }

    const cardData = cards.docs[0].data() as DigitalTravelCard;
    return cardData;
  } catch (error) {
    console.error("Error getting digital travel card:", error);
    throw error;
  }
};

// Validate QR code and process boarding
export const validateAndProcessBoarding = async (
  qrCodeData: string,
  driverId: string,
  shuttleId: string,
  routeId: string,
  location: { latitude: number; longitude: number }
): Promise<{ success: boolean; message: string; record?: BoardingRecord }> => {
  try {
    // Parse QR code data
    const qrData: QRCodeData = JSON.parse(qrCodeData);

    // Validate signature
    const dataString = `${qrData.studentId}:${qrData.userId}:${qrData.timestamp}`;
    const secret = process.env.EXPO_PUBLIC_QR_SECRET || "default-secret-key";
    const expectedSignature = await generateSignature(dataString, secret);

    if (qrData.signature !== expectedSignature) {
      return {
        success: false,
        message: "Invalid QR code signature",
      };
    }

    // Check if QR code is not too old (5 minutes)
    const now = Date.now();
    const qrAge = now - qrData.timestamp;
    if (qrAge > 5 * 60 * 1000) {
      return {
        success: false,
        message:
          "QR code has expired. Please refresh your digital travel card.",
      };
    }

    // Get student's digital travel card
    const travelCard = await getDigitalTravelCard(
      qrData.studentId,
      qrData.userId
    );

    if (!travelCard) {
      return {
        success: false,
        message: "Digital travel card not found",
      };
    }

    if (!travelCard.isActive) {
      return {
        success: false,
        message: "Digital travel card is inactive",
      };
    }

    // Create boarding record
    const recordId = `boarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const boardingRecord: BoardingRecord = {
      recordId,
      studentId: qrData.studentId,
      driverId,
      shuttleId,
      routeId,
      boardingTime: new Date(),
      location,
      status: "success",
    };

    // Save boarding record
    await addDoc(collection(firestore, "boardingRecords"), {
      ...boardingRecord,
      boardingTime: serverTimestamp(),
    });

    // Update travel card usage
    await updateDoc(doc(firestore, "digitalTravelCards", travelCard.cardId), {
      lastUsed: serverTimestamp(),
      usageCount: travelCard.usageCount + 1,
    });

    return {
      success: true,
      message: "Boarding successful",
      record: boardingRecord,
    };
  } catch (error) {
    console.error("Error validating boarding:", error);
    return {
      success: false,
      message: "Error processing boarding. Please try again.",
    };
  }
};

// Get boarding records for a driver
export const getBoardingRecords = async (
  driverId: string,
  date?: Date
): Promise<BoardingRecord[]> => {
  try {
    let boardingQuery = query(
      collection(firestore, "boardingRecords"),
      where("driverId", "==", driverId)
    );

    const records = await getDocs(boardingQuery);

    let filteredRecords = records.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          boardingTime: doc.data().boardingTime?.toDate() || new Date(),
        }) as BoardingRecord
    );

    // Filter by date on the client side to avoid index requirement
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filteredRecords = filteredRecords.filter((record) => {
        const boardingTime =
          record.boardingTime instanceof Date
            ? record.boardingTime
            : new Date(record.boardingTime);
        return boardingTime >= startOfDay && boardingTime <= endOfDay;
      });
    }

    return filteredRecords;
  } catch (error) {
    console.error("Error getting boarding records:", error);
    throw error;
  }
};

// Get boarding statistics
export const getBoardingStats = async (
  driverId: string,
  date?: Date
): Promise<{
  totalBoardings: number;
  successfulBoardings: number;
  failedBoardings: number;
  students: string[];
}> => {
  try {
    const records = await getBoardingRecords(driverId, date);

    const successfulBoardings = records.filter((r) => r.status === "success");
    const failedBoardings = records.filter((r) => r.status === "failed");
    const uniqueStudents = Array.from(new Set(records.map((r) => r.studentId)));

    return {
      totalBoardings: records.length,
      successfulBoardings: successfulBoardings.length,
      failedBoardings: failedBoardings.length,
      students: uniqueStudents,
    };
  } catch (error) {
    console.error("Error getting boarding stats:", error);
    throw error;
  }
};
