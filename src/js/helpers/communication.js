
export function send(payload, cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, payload, cb);
  });
}
