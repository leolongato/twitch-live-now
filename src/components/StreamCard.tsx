import { formatNumber } from "@/lib/utils";
import { StreamData } from "../types/Stream";
import { tabs } from "webextension-polyfill";
import { useThumbnail } from "@/context/ThumbnailContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const StreamCard: React.FC<{
  streamData: StreamData;
  streamImage: string;
}> = ({
  streamData: {
    thumbnail_url,
    user_name,
    user_login,
    game_name,
    tags,
    title,
    viewer_count,
  },
  streamImage,
}) => {
  const openStream = async (event: React.MouseEvent) => {
    await tabs.create({
      url: `https://www.twitch.tv/${user_login}`,
      active: true,
    });
  };

  const { thumbnailEnabled } = useThumbnail();

  return (
    <div
      onClick={openStream}
      className={[
        "relative border-none rounded-md shadow-lg cursor-pointer select-none w-80 bg-zinc-700/80 hover:ring-1 hover:ring-offset-1 hover:ring-offset-fuchsia-800 hover:ring-fuchsia-800",
        thumbnailEnabled ? "h-[295px]" : "h-[115px]",
      ].join(" ")}
    >
      <div className="relative">
        {thumbnailEnabled && (
          <>
            <span className="absolute bottom-0 flex items-center justify-center gap-1 px-2 m-2 rounded-xl text-zinc-100 bg-black/90 ">
              <span className="bg-red-600 rounded-full size-2.5" />
              {formatNumber(viewer_count)}
            </span>
            <img
              className="h-[180px] rounded-t-md w-full"
              src={thumbnail_url
                .replace("{width}", "480")
                .replace("{height}", "270")}
            />
          </>
        )}
      </div>

      <div className="flex justify-between">
        <h3
          className="px-2 py-1 overflow-hidden text-base font-semibold text-nowrap text-ellipsis text-zinc-100"
          title={title}
        >
          {title}
        </h3>
        {!thumbnailEnabled && (
          <span className="flex items-center justify-center gap-1 px-2 rounded-xl text-zinc-100">
            <span className="bg-red-600 rounded-full size-2.5" />
            {formatNumber(viewer_count)}
          </span>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 px-2 pb-2">
          <Avatar className="self-start mt-1 size-10">
            <AvatarImage alt="profile picture" src={streamImage} />
            <AvatarFallback>
              {user_name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2 overflow-hidden">
            <div className="flex flex-col">
              <span className="text-base font-medium text-zinc-300">
                {user_name}
              </span>
              <span
                className="w-full overflow-hidden text-xs font-medium text-zinc-400 text-nowrap text-ellipsis"
                title={game_name}
              >
                {game_name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center mx-2 space-x-2 overflow-hidden">
          {tags.slice(0, 3).map((value, key) => (
            <b
              className="
                inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2
                bg-zinc-600 text-zinc-100
                max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap
              "
              key={key}
              title={value}
            >
              {value}
            </b>
          ))}
        </div>
      </div>
    </div>
  );
};
