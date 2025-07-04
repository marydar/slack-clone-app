"use client"
import React from 'react'
import {useWorkspaceId} from "@/hooks/use-workspace-id"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import {useMemo, useEffect} from  "react"
import {Loader, TriangleAlert} from 'lucide-react'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'
import { useCurrentMember } from '@/features/members/api/use-current-member'
// interface WorkspaceIdPageProps {
//   params: {
//     workspaceId: string
//   }
// }
const WorkspaceIdPage = () => {
    const workspaceId = useWorkspaceId()
    const router = useRouter()
    const [open, setOpen] = useCreateChannelModal()

    const {data :member, isLoading:memberLoading} = useCurrentMember({workspaceId})
    const {data :workspace, isLoading:workspaceLoading} = useGetWorkspace({id:workspaceId})
    const {data:channels, isLoading: channelsLoading} = useGetChannels({workspaceId})
    const channelId = useMemo(()=> channels?.[0]?._id, [channels])
    const isAdmin = useMemo(()=> member?.role === "admin", [member?.role])
    useEffect(()=>{
        if(workspaceLoading || channelsLoading || !workspace || memberLoading || !member){
            return
        }
        if(channelId){
          router.push(`/workspace/${workspaceId}/channel/${channelId}`)
        }
        else if(!open && isAdmin){
          setOpen(true)
        }
    },[workspaceLoading, channelsLoading, workspace, channelId, open, setOpen, router, workspaceId, memberLoading, member, isAdmin])

    if(workspaceLoading || channelsLoading || memberLoading){
        return (
          <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
            <Loader className='size-6 animate-spin text-muted-foreground'/>
          </div>
        )
    }
    if(!workspace || !member){
        return (
          <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
            <TriangleAlert className='size-6  text-muted-foreground'/>
            <span className='text-sm text-muted-foreground'>Workspace not found</span>
          </div>
        )
    }
  return (
          <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
            <TriangleAlert className='size-6 text-muted-foreground'/>
            <span className='text-sm text-muted-foreground'>no channel found</span>
          </div>
        )
}

export default WorkspaceIdPage