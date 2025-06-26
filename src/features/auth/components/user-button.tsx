"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem,  DropdownMenuTrigger} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '../api/use-current-user'
import { Loader, LogOut } from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'

export const UserButton = () => {
    const {signOut} = useAuthActions();
    const {data, isLading} = useCurrentUser();
    if (isLading) {
        return <Loader className='size-4 animate-spin text-muted-foreground'/>
    };
    if(!data){
        return null;
    }
    const{image, name} = data;
    const avavtarFallback = name!.charAt(0).toUpperCase();
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none relative'>
                <Avatar className='size-10 hover:opacity-75 transition hover:cursor-pointer'>
                    <AvatarImage src={image} alt={name}/>
                    <AvatarFallback className='bg-red-800 text-white'>
                        {avavtarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className='w-60'>
                <DropdownMenuItem onClick={()=>signOut()} className='h-10'>
                    <LogOut className='size-4 mr-2'/>Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}