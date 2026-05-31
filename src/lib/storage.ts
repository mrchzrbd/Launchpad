export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return true;

  try {
    const key = "__launchpad_storage_test__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
