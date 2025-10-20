import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HashIcon } from "lucide-react";
import Link from "next/link";

const channelList = () => [
  {
    id: "1",
    name: "General",
  },
  {
    id: "2",
    name: "Random",
  },
  {
    id: "3",
    name: "Development",
  },
];

export const ChannelList = () => {
  return (
    <div className="space-y-0.5 py-1">
      {channelList().map((channel) => (
        <Link
          key={channel.id}
          href="#"
          className={buttonVariants({
            variant: "ghost",
            className: cn(
              "w-full justify-start px-2 py-1 h-7 text-muted-foreground hover:text-accent-foreground hover:bg-accent"
            ),
          })}
        >
          <HashIcon className="size-4" />
          <span className="truncate">{channel.name}</span>
        </Link>
      ))}
    </div>
  );
};
