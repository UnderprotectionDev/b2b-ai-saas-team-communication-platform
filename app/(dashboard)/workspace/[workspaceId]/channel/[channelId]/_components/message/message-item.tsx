import { SafeContent } from "@/components/rich-text-editor/safe-content";
import { getAvatar } from "@/lib/get-avatar";
import Image from "next/image";
import { MessageHoverToolbar } from "../toolbar";
import { useCallback, useState } from "react";
import { EditMessage } from "../toolbar/edit-message";
import { MessageListItem } from "@/lib/types";
import { MessageSquareIcon } from "lucide-react";
import { useThread } from "@/providers/thread-provider";
import { orpc } from "@/lib/orpc";
import { useQueryClient } from "@tanstack/react-query";
import { ReactionsBar } from "../reaction/reactions-bar";

interface MessageItemProps {
  message: MessageListItem;
  currentUserId: string;
}

export const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { openThread } = useThread();
  const queryClient = useQueryClient();

  const prefetchThread = useCallback(() => {
    const options = orpc.message.thread.list.queryOptions({
      input: { messageId: message.id },
    });

    queryClient.prefetchQuery({ ...options, staleTime: 60_000 }).catch(() => {});
  }, [message.id, queryClient]);

  return (
    <div className="flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50">
      <Image
        src={getAvatar(message.authorAvatar, message.authorEmail)}
        alt="User Avatar"
        width={32}
        height={32}
        className="size-8 rounded-full object-cover"
      />
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-x-2">
          <p className="font-medium leading-none">{message.authorName}</p>

          <p className="text-xs text-muted-foreground leading-none">
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(message.createdAt))}
          </p>

          <p className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en-GB", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(message.createdAt))}
          </p>
        </div>

        {isEditing ? (
          <EditMessage
            message={message}
            onCancel={() => setIsEditing(false)}
            onSave={() => setIsEditing(false)}
          />
        ) : (
          <>
            <SafeContent
              content={JSON.parse(message.content)}
              className="text-sm break-words prose dark:prose-invert max-w-none mark:text-primary"
            />
            {message.imageUrl && (
              <div className="mt-2">
                <Image
                  src={message.imageUrl}
                  alt="Message Attachment"
                  width={512}
                  height={512}
                  className="rounded-md max-h-[320px] w-auto object-contain"
                />
              </div>
            )}

            {/* Reactions */}
            <ReactionsBar
              messageId={message.id}
              reactions={message.reactions}
              context={{ type: "list", channelId: message.channelId! }}
            />

            {message.replyCount > 0 && (
              <button
                type="button"
                className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border cursor-pointer"
                onClick={() => openThread(message.id)}
                onMouseEnter={prefetchThread}
                onFocus={prefetchThread}
              >
                <MessageSquareIcon className="size-3.5" />
                <span>
                  {message.replyCount} {message.replyCount > 1 ? "replies" : "reply"}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  View Thread
                </span>
              </button>
            )}
          </>
        )}
      </div>

      <MessageHoverToolbar
        messageId={message.id}
        canEdit={message.authorId === currentUserId}
        onEdit={() => setIsEditing(true)}
      />
    </div>
  );
};
