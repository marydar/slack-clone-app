import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import {  ChevronDownIcon, Loader, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useRemoveMember } from "@/features/members/api/use-remove-member";
import Link from "next/link";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuRadioGroup ,DropdownMenuRadioItem} from "@/components/ui/dropdown-menu";
interface ProfileProps{
    memberId:Id<"members">
    onClose:()=>void
} 

export const Profile = ({memberId, onClose}:ProfileProps)=>{
    const router = useRouter();
    const workspaceId = useWorkspaceId()
    const {data:currentMember, isLoading:isCurrentMemberLoading} = useCurrentMember({workspaceId})
    const {data:member, isLoading:isMemberLoading} = useGetMember({id: memberId})
    const {mutate:updateMember} = useUpdateMember()
    const {mutate:removeMember} = useRemoveMember()

    const onRemove = () => {
        removeMember({memberId},{
            onSuccess:()=>{
                toast.success("Member removed")
                onClose()
            },
            onError:()=>{
                toast.error("Failed to remove member")
            },
        })
    }
    const onLeave = () => {
        removeMember({memberId},{
            onSuccess:()=>{
                router.replace('/')
                toast.success("you left the workspace")
                onClose()
            },
            onError:()=>{
                toast.error("Failed to leave the workspace")
            },
        })
    }
    const onRoleChange = (role:"admin" | "member") => {
        updateMember({memberId, role},{
            onSuccess:()=>{
                toast.success("Role changed")
                onClose()
            },
            onError:()=>{
                toast.error("Failed to change role")
            },
        })
    }
    if(isMemberLoading || isCurrentMemberLoading){
        return(
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">
                        Thread
                    </p>
                    <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
                        <XIcon className="size-5 stroke-[1.5]"/>
                    </Button>
                </div>
                <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground"/>
                </div>
            </div>
        )
    }
    if(!member){
        return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center h-[49px] px-4 border-b">
                <p className="text-lg font-bold">
                    Profile
                </p>
                <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
                    <XIcon className="size-5 stroke-[1.5]"/>
                </Button>
            </div>
            <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                <AlertTriangle className="size-5 text-muted-foreground"/>
                <p className="text-sm text-muted-foreground">Profile not found</p>
            </div>
        </div>
    )}
    const avatarFallback = member.user.name?.charAt(0).toUpperCase() ??"M"
    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center h-[49px] px-4 border-b">
                <p className="text-lg font-bold">
                    Profile
                </p>
                <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
                    <XIcon className="size-5 stroke-[1.5]"/>
                </Button>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
                <Avatar className="max-w-[256px] max-h-[256px] size-full">
                    <AvatarImage src={member.user.image} alt="Author"/>
                    <AvatarFallback className="bg-red-800 text-white text-6xl aspect-square">
                        {avatarFallback} 
                    </AvatarFallback>   
                </Avatar>
            </div>
            <div className="flex flex-col p-4">
                <p className="text-xl font-bold">
                    {member.user.name}
                </p>
                {currentMember?.role==="admin" && currentMember?._id !== memberId ? (
                    <div className="flex items-center justify-center  gap-2 mt-4 ">
                        <div className="w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"outline"} className="w-full capitalize">
                                    {member.role} <ChevronDownIcon className="size-4 ml-2"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                <DropdownMenuRadioGroup value={member.role} onValueChange={(role)=>onRoleChange(role as "admin" | "member")}>
                                    <DropdownMenuRadioItem value="admin">
                                        Admin
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="member">
                                        Member
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </div>
                        <div className="w-full">
                        <Button variant="outline" className="w-full" onClick={onRemove}>
                            Remove
                        </Button>
                        </div>
                    </div>
                ) : currentMember?.role!=="admin" && currentMember?._id === memberId ? (
                    <div className="mt-4">
                        <Button variant="outline" className="w-full" onClick={onLeave}>
                            Leave 
                        </Button>
                    </div>
                ):null
                }
            </div>
            <Separator/>
            <div className="flex flex-col p-4">
                <p className="text-sm font-bold mb-4">
                    Contact information
                </p>
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                        <MailIcon  className="size-4" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[13px] font-semibold text-muted-foreground">
                            Email address
                        </p>
                        <Link
                            href={`mailto:${member.user.email}`}
                            className="text-sm text-[#1264a3] hover:underline"
                        >
                            {member.user.email}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}