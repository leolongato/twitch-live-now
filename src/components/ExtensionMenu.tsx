import { PhotoIcon } from "@heroicons/react/16/solid";
import { useTwitchAuth } from "../context/TwitchAuthContext";
import { useThumbnail } from "@/context/ThumbnailContext";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useState } from "react";

export const ExtensionMenu: React.FC<{
  profileUrl: string;
  userName: string;
}> = ({ profileUrl, userName }) => {
  const { removeAccessToken } = useTwitchAuth();
  const { thumbnailEnabled, setThumbnailEnabled } = useThumbnail();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" />
      )}

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Avatar className="z-30 cursor-pointer size-9 hover:ring-1 hover:ring-offset-1 hover:ring-offset-zinc-500 hover:ring-zinc-500">
            <AvatarImage src={profileUrl} />
            <AvatarFallback>
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-20 w-56 text-sm font-semibold text-zinc-300 bg-zinc-800 border-zinc-700">
          <DropdownMenuLabel className="flex items-center gap-1">
            <Avatar className="mr-1 size-8">
              <AvatarImage src={profileUrl} />
              <AvatarFallback className="text-zinc-800">
                {userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            Hi, <span className="font-bold">{userName}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled={true}>
              <PhotoIcon className="size-6" />
              <span>Stream Preview</span>
            </DropdownMenuItem>

            <Tabs
              defaultValue={thumbnailEnabled ? "enabled" : "disabled"}
              className="flex justify-center w-full pb-1.5 dark px-2"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  onClick={() => setThumbnailEnabled(true)}
                  value="enabled"
                >
                  Enabled
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setThumbnailEnabled(false)}
                  value="disabled"
                >
                  Disabled
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500 cursor-pointer focus:text-red-400 focus:bg-zinc-700/90"
            onClick={() => removeAccessToken()}
          >
            <LogOut />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
