import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  MenuSection,
  MenuSeparator,
  Switch,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  ArrowLeftStartOnRectangleIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/16/solid";
import { useTwitchAuth } from "../context/TwitchAuthContext";
import { useThumbnail } from "@/context/ThumbnailContext";

export const ExtensionMenu: React.FC<{
  profileUrl: string;
  userName: string;
}> = ({ profileUrl, userName }) => {
  const { removeAccessToken } = useTwitchAuth();
  const { thumbnailEnabled, setThumbnailEnabled } = useThumbnail();

  return (
    <Menu>
      <MenuButton className="inline-flex items-center gap-1 p-1 px-2 ml-auto font-semibold rounded-lg text-sm/6 text-slate-100 focus:outline-none hover:bg-zinc-700/90">
        <img
          src={profileUrl}
          alt="profile picture"
          className="rounded-full size-7"
        />
        <ChevronDownIcon className="size-8 fill-white/60" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 z-20 text-base origin-top-right rounded-xl bg-zinc-800 border border-white/5 bg-purple p-1 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuSection>
          <div className="py-1.5 px-3 space-y-2">
            <span className="text-sm text-zinc-300">Preferences</span>
            <div className="flex items-center gap-2 text-zinc-100">
              <ComputerDesktopIcon className="size-6 fill-slate/70" />
              <span>Thumbnails</span>
              <Switch
                checked={thumbnailEnabled}
                onChange={() => setThumbnailEnabled(!thumbnailEnabled)}
                className="group relative flex h-5 w-10 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-green-700"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                />
              </Switch>
            </div>
          </div>
        </MenuSection>
        <MenuSeparator className="h-px my-1 bg-white/5" />
        <MenuItem>
          <button
            onClick={() => removeAccessToken()}
            className="group flex w-full text-red-400  items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-zinc-700/90"
          >
            <ArrowLeftStartOnRectangleIcon className="size-6 fill-slate/70" />
            Logout
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
