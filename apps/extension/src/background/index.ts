async function createOffscreen() {
  const offscreenUrl = chrome.runtime.getURL("offscreen.html");
  const existing = await chrome.offscreen.hasDocument();
  if (existing) return;

  await chrome.offscreen.createDocument({
    url: offscreenUrl,
    reasons: ["USER_MEDIA"],
    justification: "Record tab audio and microphone",
  });
}

chrome.runtime.onMessage.addListener(async (message) => {
  await createOffscreen();
  if (message.type === "start-recording") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tab.id,
    });

    chrome.runtime.sendMessage({
      target: "offscreen",
      type: "start-recording",
      data: streamId,
    });
  }
});
