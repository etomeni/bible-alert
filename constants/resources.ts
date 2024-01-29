import AsyncStorage from "@react-native-async-storage/async-storage";
import { Voice, getAvailableVoicesAsync } from "expo-speech";

export async function getEnglishVoicesAsync() {
  const voices: Voice[] = await getAvailableVoicesAsync();
  if (voices && voices.length) {
    const en_Voices: Voice[] = voices.filter((voice) =>
      voice.language.includes("en-")
    );
    // console.log(en_Voices);
    return en_Voices;
  }
  const noVoice: Voice[] = [];
  return noVoice;
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Comprehensive email validation regex
  return emailRegex.test(email);
};

// remove Special Characters And Replace Spaces
export function sanitizedString(text: string) {
  // Use a regular expression to match special characters and spaces
  const regex = /[^a-zA-Z0-9\s]/g;

  // Replace special characters with an empty string and spaces with hyphens
  const sanitizedString = text.replace(regex, "").replace(/\s+/g, "-");

  return sanitizedString;
}

export function getCurrentDateTime() {
  const now = new Date();

  // Get the date components
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Get the time components
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Assemble the date-time string
  const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

  return dateTimeString;
}

// THE FOLLOWING FUNCTIONS ARE USED FOR LOCAL STORAGE
export async function setLocalStorage(storageKey: string, value: any) {
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("AsyncStorage error:", error);
    return false;
  }
}

export async function getLocalStorage(storageKey: string) {
  try {
    const value = await AsyncStorage.getItem(storageKey);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    console.error("AsyncStorage error:", error);
    return null;
  }
}

export async function removeLocalStorageItem(storageKey: string) {
  await AsyncStorage.removeItem(storageKey);
}

export async function clearLocalStorage() {
  await AsyncStorage.clear();
}

// THE FOLLOWING FUNCTIONS ARE USED FOR SESSION STORAGE
export async function setSessionStorage(storageKey: string, value: any) {
  const encryptedvalue = btoa(escape(JSON.stringify(value)));
  return await sessionStorage.setItem(storageKey, encryptedvalue);
}

export function getSessionStorage(storageKey: string) {
  return new Promise((resolve) => {
    const localData = sessionStorage.getItem(storageKey);
    if (localData) {
      resolve(JSON.parse(unescape(atob(localData))));
    } else {
      resolve(false);
    }
  });
}

export async function removeSessionStorageItem(storageKey: string) {
  await sessionStorage.removeItem(storageKey);
}

export async function clearSessionStorage() {
  await sessionStorage.clear();
}
