import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { AlertTriangle, Loader } from 'lucide-react'
import { WorkspaceHeader } from './workspace-header';
export const WorkspaceSidebar = () =>{
    const workspaceId = useWorkspaceId();
    const {data: member, isLoading:memberLoading} = useCurrentMember({workspaceId});
    const {data: workspace, isLoading:workspaceLoading} = useGetWorkspace({id: workspaceId});
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
        </div>
    )
}