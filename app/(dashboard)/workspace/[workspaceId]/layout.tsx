import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CreateNewChannel } from "./_components/create-new-channel";
import { WorkspaceHeader } from "./_components/workspace-header";
import { ChevronUpIcon } from "lucide-react";
import { ChannelList } from "./_components/channel-list";
import { WorkspaceMembersList } from "./_components/workspace-members-list";

interface ChannelListLayoutProps {
  children: React.ReactNode;
}

export default function ChannelListLayout({ children }: ChannelListLayoutProps) {
  return (
    <>
      <div className="flex h-full w-80 flex-col bg-secondary border-r border-border">
        {/* Header */}
        <div className="flex items-center px-4 h-14 border-b border-border">
          <WorkspaceHeader />
        </div>
        <div className="px-4 py-2">
          <CreateNewChannel />
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto px-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full justify-between items-center px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180">
              Main
              <ChevronUpIcon className="size-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ChannelList />
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Members List */}
        <div className="px-4 py-2 border-t border-border">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full justify-between items-center px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180">
              Members
              <ChevronUpIcon className="size-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <WorkspaceMembersList />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </>
  );
}
