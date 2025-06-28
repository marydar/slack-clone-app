"use client";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}
const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
    return ( 
        <div className="h-full bg-gray-300">
            <Toolbar/>
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar/>
                {children}
            </div>
        </div> 
    );
}
 
export default WorkspaceIdLayout;