import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Search, Info } from "lucide-react"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useGetChannels } from "@/features/channels/api/use-get-channels"

export const Toolbar = () => {
    const router = useRouter()
    const workspaceId = useWorkspaceId();
    const {data} = useGetWorkspace({id: workspaceId})
    const [open, setOpen] = useState(false)
    const {data: channels} = useGetChannels({workspaceId})
    const {data:members} = useGetMembers({workspaceId})

    const onChannelClick = (channelId: string) => {
        setOpen(false)
        router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    }
    const onMemberClick = (memberId: string) => {
        setOpen(false)
        router.push(`/workspace/${workspaceId}/member/${memberId}`)
    }
    return (
        <nav className="bg-blue-950 flex items-center justify-between h-10 p-1.5 text-white">
            <div className="flex-1"/>
                <div className="min-w-[280px] max-[642px] grow-[2] shrink ">
                    <Button onClick={()=>setOpen(true)} size="sm" className="w-full bg-accent/25 hover:bg-accent/25 justify-start h-7 px-2">
                        <Search className="size-4 mr-2 text-white"/>
                        <span className="text-white text-xs">
                            Search {data?.name}
                        </span>
                    </Button>
                    <CommandDialog open={open} onOpenChange={setOpen}>
                        <CommandInput placeholder="Type a command or search..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="channels">
                                {channels?.map((channel) => (
                                    <CommandItem key={channel._id}  onSelect={()=>onChannelClick(channel._id)}>
                                            {channel.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="members">
                                {members?.map((member) => (
                                    <CommandItem key={member._id}  onSelect={()=>onMemberClick(member._id)}>
                                            {member.user.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </CommandDialog>
                </div>
                <div className="ml-auto flex-1 flex items-center justify-end">
                    <Button variant="transparent" size="iconSm">
                        <Info className="size-5 text-white"/>
                    </Button>
                </div>
            </nav> 
    )
}