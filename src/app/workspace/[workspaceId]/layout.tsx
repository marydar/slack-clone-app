"use client";
import { Toolbar } from "./toolbar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}
const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
    return ( 
        <div className="h-full bg-white">
            <Toolbar/>
            {children}
        </div> 
    );
}
 
export default WorkspaceIdLayout;