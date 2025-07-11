"use client"
import React, { use, useEffect, useState } from 'react'
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useMemberId } from '@/hooks/use-member-id';
import { useCreateOrGetConversation } from '@/features/conversations/api/use-create-or-get-conversation';
import { Loader } from 'lucide-react';
import { TriangleAlert } from 'lucide-react';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { Conversation } from './conversation';

const MemberIdPage = () => {
    const workspaceId = useWorkspaceId();
    const memberId = useMemberId();
    const [conversationId, setConversationId] = useState<Id<"conversations">|null>(null)    
    const {mutate, isPending} = useCreateOrGetConversation()
    useEffect(()=>{
        mutate({
            workspaceId, memberId
        }, {
            onSuccess:(id)=>{
                console.log("success")
                setConversationId(id)
            },
            onError:()=>{
                toast.error("Error creating conversation")
            },
        })
    },
    [workspaceId, memberId, mutate])

    if(isPending) return (
        <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
            <Loader className='size-6 animate-spin text-muted-foreground'/>
        </div>
    )
    if(!conversationId){
        return (
            <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
                <TriangleAlert className='size-6 text-muted-foreground'/>
                <span className='text-sm text-muted-foreground'>
                    conversation not found
                </span>
            </div>
        )
    }
  return (
    <Conversation id={conversationId}/> 
  )
}

export default MemberIdPage