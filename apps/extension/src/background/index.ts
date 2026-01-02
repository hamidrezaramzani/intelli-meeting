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
  if (message.type === "start-recording") {
    await createOffscreen();

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tab.id,
    });
    const monitorTabAudio =
      typeof message.monitorTabAudio === "boolean"
        ? message.monitorTabAudio
        : true;

    chrome.runtime.sendMessage({
      target: "offscreen",
      type: "start-recording",
      data: {
        streamId,
        monitorTabAudio,
      },
    });
  }
});
