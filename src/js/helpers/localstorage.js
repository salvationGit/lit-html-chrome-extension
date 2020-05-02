/* istanbul ignore file */
export default class {
  static loadFromStorage(key) {
    return new Promise(resolve => {
      chrome.storage.local.get(key, data => {
        if (chrome.runtime.lastError) {
          resolve();
        }
        if (data) {
          resolve(data[key]);
        }
      });
    });
  }

  static persistToStorage(key, payload) {
    chrome.storage.local.set({ [key]: payload }, () => {
      if (chrome.runtime.lastError) {
        throw Error(chrome.runtime.lastError);
      }
    });
  }
}
