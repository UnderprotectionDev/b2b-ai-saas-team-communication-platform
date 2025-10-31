import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { MemberItem } from "./member-item";
import { Skeleton } from "@/components/ui/skeleton";

export const MemberOverview = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery(orpc.workspace.member.list.queryOptions());

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  const members = data ?? [];

  const query = search.trim().toLowerCase();

  const filteredMembers = query
    ? members.filter((member) => {
        const name = member.full_name?.toLowerCase();
        const email = member.email?.toLowerCase();

        return name?.includes(query) || email?.includes(query);
      })
    : members;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <UsersIcon />
          <span>Members</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-[300px]">
        <div className="p-0">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Workspace Members</h3>
            <p className="text-xs text-muted-foreground">Members</p>
          </div>

          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <SearchIcon className="size-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8"
                placeholder="Search members..."
              />
            </div>
          </div>

          {/* Members */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 px-4 py-2">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))
            ) : filteredMembers.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">No members Found</p>
            ) : (
              filteredMembers.map((member) => <MemberItem key={member.id} member={member} />)
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
