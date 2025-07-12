import React from 'react'
import { Button } from '@/components/ui/button'
import { FaChevronDown } from 'react-icons/fa'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { TrashIcon } from 'lucide-react'
import {useState} from "react"
import { Input } from '@/components/ui/input'
import { useChannelId } from '@/hooks/use-channel-id'
import { useUpdateChannel } from '@/features/channels/api/use-update-channel'
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel'
import {toast} from "sonner"
import { useRouter } from 'next/navigation'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useCurrentMember } from '@/features/members/api/use-current-member'


interface HeaderProps{
    channelName:string
}
export const Header = ({channelName}:HeaderProps) => {
    const router = useRouter();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
   const [editOpen, setEditOpen] = useState(false);
   const [value, setValue] = useState("");
   const {data:member} = useCurrentMember({workspaceId});
   const handleChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value  = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setValue(value);   
    }
    const {mutate:updateChannel, isPending: isUpdatingChannel} = useUpdateChannel();
    const {mutate:removeChannel, isPending: isRemovingChannel} = useRemoveChannel();


    const handleEditOpen = () => {
        if(!member || member.role!=="admin") return
        setEditOpen(true)
    }
    const handleRemove = () => {
        removeChannel({channelId:channelId},
            {
                onSuccess:()=>{
                    toast.success("channel deleted")
                    router.push(`/workspace/${workspaceId}`)
                },
                onError:()=>{
                    toast.error("Failed to delete channel")
                },
            }
        )
    }
    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateChannel({channelId:channelId, name:value},
            {
                onSuccess:()=>{
                    toast.success("channel name updated")
                    setEditOpen(false)
                },
                onError:()=>{
                    toast.error("Failed to update channel name")
                },
            }

        )
    }
  return (
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="text-lg font-semibold px-2 overflow-hidden w-auto"
                    size="sm" 
                >
                <span className='truncate'># {channelName}</span>
                <FaChevronDown className='size-2.5 ml-2'/>
                </Button>
            </DialogTrigger>
            <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
                <DialogHeader className='p-4 border-b bg-white '>
                    <DialogTitle>
                        # {channelName}
                    </DialogTitle>
                </DialogHeader>
                <div className='px-4 pb-4 flex flex-col gap-y-2'>
                    <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                        <DialogTrigger asChild>
                            <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
                                <div className='flex items-center justify-between'>
                                    <p className='text-sm font-semibold '>Channel name</p>
                                    {member?.role ==="admin" && (
                                    <p className='text-sm font-semibold hover:underline text-[#1264a3]'>Edit</p>
                                    )}
                                </div>
                                <p className='text-sm'># {channelName}</p>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Rename this channel
                                </DialogTitle>
                            </DialogHeader>
                            <form className="space-y-4" onSubmit={handleEdit}>
                                <Input
                                    value={value}
                                    onChange={handleChange}
                                    disabled={isUpdatingChannel}
                                    required
                                    autoFocus
                                    minLength={3}
                                    maxLength={80}
                                    placeholder="channel name e.g. 'channel', 'plan-budget'"
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant={"outline"} disabled={isUpdatingChannel}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        disabled={isUpdatingChannel}
                                    >
                                        Save
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    {member?.role ==="admin" && (
                    <button
                        onClick={handleRemove}
                        disabled={isRemovingChannel}
                        className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600'
                    >
                        <TrashIcon className='size-4'/>
                        <p className='text-sm font-semibold'>Delete channel</p>
                    </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    </div>
  )
}
