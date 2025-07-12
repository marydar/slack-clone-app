"use client"

import Image from "next/image"
import  VerificationInput  from "react-verification-input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspaceInfo } from "../../../features/workspaces/api/use-get-workspace-info";
import {Loader} from "lucide-react";
import {useJoin} from "../../../features/workspaces/api/use-join";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import { useMemo, useEffect } from "react";
interface JoinPageProps{
    params:{
        workspaceId:string
    }
}
const JoinPage = ({params}:JoinPageProps) => {
    const workspaceId = useWorkspaceId()
    const {data, isLoading} = useGetWorkspaceInfo({id:workspaceId})
    const isMember = useMemo(()=>data?.isMember, [data?.isMember])
    const {mutate, isPending} = useJoin()
    const router  = useRouter()
    useEffect(()=>{
        if(isMember){
            router.push(`/workspace/${workspaceId}`)
        }
    },[isMember, router, workspaceId])
    if(isLoading){
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-6  animate-spin text-muted-foreground  "/>
            </div>
        )
    }
    const handleComplete = (value:string) => {
        mutate({workspaceId, joinCode:value}
            ,{
                onSuccess:(id)=>{
                    router.replace(`/workspace/${id}`)
                    toast.success("joined workspace")
                },
                onError:()=>{
                    toast.error("failed to join workspace")
                }
            }
        )
    }
    return (
        <div className="flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md h-full"> 
            <Image src="/globe.svg" alt="logo" width={60} height={60}/>
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className="flex flex-col items-center justify-center gap-y-2">
                    <h1 className="text-2xl font-bold tracking-widest uppercase">Join workspace</h1>
                    <p className="text-md text-muted-foreground">Enter the workspace code to join</p>
                </div>
                <VerificationInput
                onComplete={handleComplete}
                length={6}
                    classNames={{
                        container: cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
                        character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
                        characterInactive:"bg-muted",
                        characterSelected:"bg-white text-black",
                        characterFilled:"bg-white text-black"

                    }}
                    autoFocus
                />
            </div>
            <div className="flex gap-x-4 ">
                <Button 
                    size="lg"
                    variant="outline"
                    asChild
                >
                    <Link href="/">
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    )
}
export  default JoinPage