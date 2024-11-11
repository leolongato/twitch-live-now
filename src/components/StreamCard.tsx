import { formatNumber } from "@/lib/utils";
import { StreamData } from "../types/Stream";
import { tabs } from "webextension-polyfill";
import { useThumbnail } from "@/context/ThumbnailContext";

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
        "relative border-none rounded-md shadow-lg cursor-pointer select-none w-80 bg-zinc-700/80 hover:ring-2 hover:ring-offset-2 hover:ring-offset-zinc-700/80 hover:ring-fuchsia-800",
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
              alt="stream thumbnail"
              loading="lazy"
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
          <img
            src={streamImage}
            alt="profile picture"
            className="self-start w-10 h-10 mt-1 rounded-full"
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="text-base font-medium text-zinc-300">
                {user_name}
              </span>
              <span className="text-xs font-medium text-zinc-400">
                {game_name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center mx-2 space-x-2 overflow-hidden">
          {tags.slice(0, 3).map((value, key) => (
            <b
              className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-zinc-600 rounded-full text-zinc-100 mb-2"
              key={key}
            >
              {value}
            </b>
          ))}
        </div>
      </div>
    </div>
  );
};
