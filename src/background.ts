//@ts-nocheck
import browser from "webextension-polyfill";

browser.action.onClicked.addListener(async (tab: browser.Tabs.Tab) => {
  await browser.sidePanel.setOptions({
    path: "index.html",
  });

  await browser.sidePanel.open(
    {
      windowId: tab.windowId,
    },
    async () => {
      await browser.action.setPopup({
        popup: "index.html",
        tabId: tab.id,
      });

      await browser.action.openPopup();
    }
  );
});
