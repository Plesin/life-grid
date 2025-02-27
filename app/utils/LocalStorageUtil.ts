export class LocalStorageUtil {
  static ns = "lfgrid";

  static set(key: string, value: unknown) {
    try {
      localStorage.setItem(`${this.ns}:${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting key - ${key}: ${error}`);
    }
  }

  static get(key: string, defaultValue = null) {
    try {
      const storedValue = localStorage.getItem(`${this.ns}:${key}`);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading key - ${key}: ${error}`);
      return defaultValue;
    }
  }

  static has(key: string) {
    return localStorage.getItem(`${this.ns}:${key}`) !== null;
  }

  static remove(key: string) {
    try {
      localStorage.removeItem(`${this.ns}:${key}`);
    } catch (error) {
      console.error(`Error removing key - ${key}: ${error}`);
    }
  }
}
