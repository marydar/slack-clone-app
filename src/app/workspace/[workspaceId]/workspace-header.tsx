import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ChevronDown, SquarePen, ListFilter } from "lucide-react";
import { Hint } from "@/components/hint";
import { PreferencesModal } from "./preferences-modal";
import { useState } from "react";
import { InviteModal } from "./invite-modal";
interface WorkspaceHeaderProps{
    workspace: Doc<"workspaces">
    isAdmin: boolean
}
export const WorkspaceHeader = ({workspace, isAdmin}:WorkspaceHeaderProps) => {
    const [preferencesOpen, setPreferencesOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);    
    return (
        <>
        <InviteModal
            open={inviteOpen}
            setOpen={setInviteOpen}
            name={workspace.name}
            joinCode={workspace.joinCode}
        />
        <PreferencesModal open={preferencesOpen} setOpen={setPreferencesOpen} initialValue={workspace.name}/>
        <div className="flex items-center justify-between gap-0.5 h-[49px] px-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"transparent"} className=' font-semibold text-lg p-1.5 overflow-hidden w-auto' size="sm">
                        <span className='text-white truncate'>{workspace.name}</span>
                        <ChevronDown className='size-4 ml-1 shrink-0'/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="bottom" className='w-64'>
                    <DropdownMenuItem className='cursor-pointer capitalize' onClick={()=>{}}>
                        <div className='shrink-0 size-9 relative overflow-hidden bg-blue-900  text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2'>
                            {workspace.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col items-start">
                            <p className='truncate font-bold'>{workspace.name}</p>
                            <p className='text-xs text-muted-foreground'>
                                Active workspace
                            </p>
                        </div>
                    </DropdownMenuItem>
                    {isAdmin && (
                        <>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem className="cursor-pointer py-2" onClick={()=>setInviteOpen(true)}>
                                Invite people to {workspace.name}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem className="cursor-pointer py-2" onClick={()=>setPreferencesOpen(true)}>
                                Preferences
                            </DropdownMenuItem>
                        </>
                    )}
                    
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-0.5">
                <Hint label="Filter conversations" side="bottom">
                    <Button variant={"transparent"} size="iconSm">
                        <ListFilter className="size-4 text-white"/>
                    </Button>
                </Hint>
                <Hint label="New message" side="bottom">
                    <Button variant={"transparent"} size="iconSm">
                        <SquarePen className="size-4 text-white"/>
                    </Button>
                </Hint>
            </div>
        </div>
        </>
    )
}