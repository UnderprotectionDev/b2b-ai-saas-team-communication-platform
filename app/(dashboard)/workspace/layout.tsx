import { orpc } from "@/lib/orpc";
import { CreateWorkspace } from "./_components/create-workspace";
import { UserNav } from "./_components/user-nav";
import { WorkspaceList } from "./_components/workspace-list";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export default async function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.workspace.list.queryOptions());

  return (
    <div className="flex w-full h-screen">
      <div className="flex h-full w-16 flex-col items-center bg-secondary py-3 px-2 border-r border-border">
        <HydrateClient client={queryClient}>
          <WorkspaceList />
        </HydrateClient>
        <div className="mt-4">
          <CreateWorkspace />
        </div>
        <div className="mt-auto">
          <HydrateClient client={queryClient}>
            <UserNav />
          </HydrateClient>
        </div>
      </div>
      {children}
    </div>
  );
}
