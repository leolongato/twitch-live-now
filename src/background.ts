import browser from "webextension-polyfill";

// Trigger side panel opening when extension icon is clicked
browser.action.onClicked.addListener((tab: browser.Tabs.Tab) => {
  //@ts-ignore
  browser.sidePanel.setOptions({
    path: "index.html",
  });
  //@ts-ignore
  browser.sidePanel.open({ windowId: tab.windowId });
});
