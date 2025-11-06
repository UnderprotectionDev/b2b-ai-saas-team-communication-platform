import { SafeContent } from "@/components/rich-text-editor/safe-content";
import { Message } from "@/lib/generated/prisma";
import Image from "next/image";

interface ThreadReplyProps {
  message: Message;
}

export const ThreadReply = ({ message }: ThreadReplyProps) => {
  return (
    <div className="flex space-x-3 p-3 hover:bg-muted/30 rounded-lg">
      <Image
        src={message.authorAvatar}
        alt="Author Image"
        width={32}
        height={32}
        className="size-9 rounded-full shrink-0"
      />
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{message.authorName}</span>
          <span className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              month: "short",
              day: "numeric",
            }).format(message.createdAt)}
          </span>
        </div>

        <SafeContent
          className="text-sm break-words prose dark:prose-invert max-w-none marker:text-primary"
          content={JSON.parse(message.content)}
        />
      </div>
    </div>
  );
};
