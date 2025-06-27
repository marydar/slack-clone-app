"use client";
import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const {data, isLading} = useGetWorkspaces();
  const workspaceId = useMemo(()=>data?.[0]?._id, [data]); 
  useEffect(()=>{
    if(isLading){
      console.log("loading");
      return;
    }
    if(workspaceId){
      console.log("redirect to workspace");
      router.replace(`/workspace/${workspaceId}`)
    }
    else if(!open){
      setOpen(true);
      console.log("open create workspace modal");
    }
  }, [workspaceId, isLading, open, setOpen, router])
  return (

    <div>
      logged in
      <UserButton/>
    </div>
  )
}
