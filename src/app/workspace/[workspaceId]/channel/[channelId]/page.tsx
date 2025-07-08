"use client"
import React from 'react'
import {useChannelId} from "@/hooks/use-channel-id"
import { useGetChannel } from '@/features/channels/api/use-get-channel'
import { Loader, TriangleAlert } from 'lucide-react'
import { Header } from './header'
import {ChatInput}  from './chat-input'
import { useGetMessages } from '@/features/messages/api/use-get-messages'

const ChannelIdPage = () => {
    const channelId = useChannelId()
    const {results} = useGetMessages({channelId})
    const {data:channel, isLoading:channelLoading} = useGetChannel({channelId})
    console.log(results)
    if(channelLoading){
        return (
            <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
                <Loader className='size-6 animate-spin text-muted-foreground'/>
            </div>
        )
    }
    if(!channel){
        return (
            <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
                <TriangleAlert className='size-6 text-muted-foreground'/>
                <span className='text-sm text-muted-foreground'>
                    Channel not found
                </span>
            </div>
        )
    }
  return (
    <div className='flex flex-col h-full'>
        <Header channelName={channel.name}/>
        <div className='flex-1'>
            {JSON.stringify(results)}
        </div>
        <ChatInput placeholder={`${channel.name} — Type something...`}/>
    </div>
  )
}

export default ChannelIdPage