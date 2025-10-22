import { ChannelHeader } from "./_components/channel-header";
import { MessageInputForm } from "./_components/message/message-input-form";
import { MessagesList } from "./_components/messages-list";

export default function ChannelPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Main Channel Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Fixed Header */}
        <ChannelHeader />
        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-hidden mb-4">
          <MessagesList />
        </div>

        {/* Fixed Input */}
        <div className="border-t bg-background p-4">
          <MessageInputForm />
        </div>
      </div>
    </div>
  );
}
