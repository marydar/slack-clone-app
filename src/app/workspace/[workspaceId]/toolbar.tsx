import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Search, Info } from "lucide-react"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"

export const Toolbar = () => {
    const workspaceId = useWorkspaceId();
    const {data} = useGetWorkspace({id: workspaceId})
    return (
        <nav className="bg-cyan-950 flex items-center justify-between h-10 p-1.5 text-white">
            <div className="flex-1"/>
                <div className="min-w-[280px] max-[642px] grow-[2] shrink ">
                    <Button size="sm" className="w-full bg-accent/25 hover:bg-accent/25 justify-start h-7 px-2">
                        <Search className="size-4 mr-2 text-white"/>
                        <span className="text-white text-xs">
                            Search {data?.name}
                        </span>
                    </Button>
                </div>
                <div className="ml-auto flex-1 flex items-center justify-end">
                    <Button variant="transparent" size="iconSm">
                        <Info className="size-5 text-white"/>
                    </Button>
                </div>
            </nav> 
    )
}