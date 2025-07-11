import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { AlertTriangle, HashIcon, Loader, MessageSquare, MessageSquareText, SendHorizonal } from 'lucide-react'
import { WorkspaceHeader } from './workspace-header';
import { SidebarItem } from './sidebar-item';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { WorkspaceSection } from './workspace-section';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { UserItem } from './user-item';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useChannelId } from '@/hooks/use-channel-id';
import { useMemberId } from '@/hooks/use-member-id';
export const WorkspaceSidebar = () =>{
    const memberId = useMemberId();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const {data: member, isLoading:memberLoading} = useCurrentMember({workspaceId});
    const {data: workspace, isLoading:workspaceLoading} = useGetWorkspace({id: workspaceId});
    const {data: channels, isLoading:channelsLoading} = useGetChannels({workspaceId});
    const {data:members, isLoading:membersLoading} = useGetMembers({workspaceId});
    const [_open, setOpen] = useCreateChannelModal();
    if (workspaceLoading || memberLoading) {
        return (
            <div className='flex flex-col items-center justify-center h-full bg-[#26366B]'>
                <Loader className='size-5 animate-spin text-white'/>
            </div>
        )
        
    }
    if (!workspace || !member) {
        return (
            <div className='flex flex-col gap-y-2 items-center justify-center h-full bg-[#26366B]'>
                <AlertTriangle className='size-5 text-white'/>
                <p className='text-sm text-white'>
                    Workspace not found
                </p>
            </div>
        )
        
    }
    return (
        <div className='flex flex-col h-full bg-[#26366B]'>
            <WorkspaceHeader workspace={workspace} isAdmin={member.role==="admin"}/>
            <div className='flex flex-col px-2 mt-3'>
                <SidebarItem
                    label="Threads"
                    icon={MessageSquareText}
                    id="threads"
                    
                />
                <SidebarItem
                    label="Drafts and sent"
                    icon={SendHorizonal}
                    id="drafts"
                    
                />
            </div>
                <WorkspaceSection
                    label="Channels"
                    hint="New channel"
                    onNew={member.role==="admin"?()=>setOpen(true):undefined}
                >
                    {channels?.map((item)=>(
                        <SidebarItem
                            key={item._id}
                            label={item.name}
                            icon={HashIcon}
                            id={item._id}
                            variant={channelId === item._id ? "active" : "default"}
                            
                        />
                    ))}
                </WorkspaceSection>
                <WorkspaceSection
                    label="Direct Messages"
                    hint="New channel"
                    onNew={()=>{}}
                >
                    {members?.map((item)=>(
                        <UserItem 
                            key={item._id}
                            id={item._id}
                            label={item.user.name}
                            image={item.user.image}
                            variant={item._id === memberId ? "active" : "default"}
                        />
                    ))}
                </WorkspaceSection>
                
        </div>
    )
}