//@ts-nocheck
import browser from "webextension-polyfill";

browser.action.onClicked.addListener(async (tab: browser.Tabs.Tab) => {
  await browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  browser.sidePanel.open({
    windowId: tab.windowId,
  });
});
