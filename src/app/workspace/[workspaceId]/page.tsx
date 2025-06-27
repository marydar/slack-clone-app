"use client"
import React from 'react'
import {useWorkspaceId} from "@/hooks/use-workspace-id"
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
// interface WorkspaceIdPageProps {
//   params: {
//     workspaceId: string
//   }
// }
const WorkspaceIdPage = () => {
    const workspaceId = useWorkspaceId()
    const {data } = useGetWorkspace({id: workspaceId})
  return (
    <div>Data: {JSON.stringify(data)}</div>
  )
}

export default WorkspaceIdPage