import { Platform } from "react-native";
import Constants from "expo-constants";

export function getApiBaseUrl() {
  // For physical devices using Expo Go
  if (__DEV__) {
    // Android Emulator - special IP for localhost
    if (Platform.OS === "android" && !Constants.expoConfig?.hostUri) {
      return "http://10.0.2.2:3000";
    }

    // iOS Simulator - localhost works directly
    if ((Platform.OS === "ios" && !Constants.expoConfig?.hostUri) || Platform.OS === "web") {
      return "http://localhost:3000";
    }

    // Physical device with Expo Go - use the device's connection to dev machine
    const expoHost = Constants.expoConfig?.hostUri;
    if (expoHost) {
      const host = expoHost.split(":")[0];
      return `http://${host}:3000`;
    }
  }
}

const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    MOVIES: "/movies",
    SCREENINGS: "/screenings",
    REVIEWS: "/reviews",
    BOOKINGS: "/bookings",
    FNB_ITEMS: "/fnbItems",
    PAYMENTS: "/payments",
  },
};

export default API_CONFIG;
