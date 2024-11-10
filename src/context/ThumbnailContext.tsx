import React, { createContext, useContext, useEffect, useState } from "react";
import browser from "webextension-polyfill";

const ThumbnailContext = createContext<
  | {
      thumbnailEnabled: boolean;
      setThumbnailEnabled: (enabled: boolean) => void;
    }
  | undefined
>(undefined);

export const ThumbnailProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [thumbnailEnabled, setThumbnailEnabledState] = useState<boolean>(true);

  useEffect(() => {
    async function getThumbnail() {
      try {
        const res = await browser.storage.sync.get("tw-enable-tbnl");
        const isEnabled =
          res?.["tw-enable-tbnl"] !== undefined
            ? Boolean(res["tw-enable-tbnl"])
            : true;
        setThumbnailEnabledState(isEnabled);
      } catch (error) {
        console.error("Error fetching thumbnail setting from storage:", error);
      }
    }

    getThumbnail();
  }, []);

  const setThumbnailEnabled = async (enabled: boolean) => {
    try {
      setThumbnailEnabledState(enabled);

      await browser.storage.sync.set({ "tw-enable-tbnl": enabled });
    } catch (error) {
      console.error("Error updating thumbnail setting in storage:", error);
    }
  };

  return (
    <ThumbnailContext.Provider
      value={{ thumbnailEnabled, setThumbnailEnabled }}
    >
      {children}
    </ThumbnailContext.Provider>
  );
};

export const useThumbnail = () => {
  const context = useContext(ThumbnailContext);
  if (!context) {
    throw new Error("useThumbnail must be used within a ThumbnailProvider");
  }
  return context;
};
