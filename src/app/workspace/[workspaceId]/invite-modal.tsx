import React from 'react'

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {CopyIcon} from 'lucide-react'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import {toast} from 'sonner'
import { useNewJoinCode } from '../../../features/workspaces/api/use-new-join-code'
import { RefreshCcw } from 'lucide-react'

interface InviteModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  name: string
  joinCode: string

}
export const InviteModal = ({open, setOpen, name, joinCode}:InviteModalProps) => {
    const workspaceId = useWorkspaceId()
    const {mutate, isPending} = useNewJoinCode()

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;

        navigator.clipboard.writeText(inviteLink)
        .then(()=>toast.success("invite link copied to clipboard"))

    }
    const handleNewCode = () => {
        mutate({workspaceId}
            ,{
                onSuccess:()=>{
                    toast.success("new code generated")
                }
                ,
                onError:()=>{
                    toast.error("failed to regenerate invite code")
                }
            }
        )
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Invite people</DialogTitle>
                <DialogDescription>
                    use the code below to invite people to your workspace
                </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-y-4 items-center justify-center py-10'>
                <p className='text-4xl font-bold tracking-widest uppercase'>{joinCode}</p>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                    Copy link
                    <CopyIcon className='size-4 ml-2'/>
                </Button>
            </div>
            <div className='flex items-center justify-between w-full'>
                <Button disabled={isPending} onClick={handleNewCode} variant={'outline'}>
                    New code
                    <RefreshCcw className="size-4 ml-2"/>
                </Button>
                <DialogClose asChild>
                    <Button>
                        close
                    </Button>
                </DialogClose>
            </div>
        </DialogContent>
    </Dialog>
  )
}
