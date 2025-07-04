"use client";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./workspace-sidebar";
interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}
const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
    return ( 
        <div className="h-full bg-gray-300">
            <Toolbar/>
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar/>
                <ResizablePanelGroup
                    direction="horizontal"
                    autoSaveId="ca-workspace-layout "
                >
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className="bg-[#26366B]"
                    >
                        <WorkspaceSidebar/>
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel 
                        minSize={20}
                        className="bg-[#ABABAD]">
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div> 
    );
}
 
export default WorkspaceIdLayout;