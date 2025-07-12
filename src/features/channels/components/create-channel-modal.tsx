import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";

import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateChannel } from "../api/use-create-channel";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";

export const CreateChannelModal = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [open, setOpen] = useCreateChannelModal();
    const [name, setName] = useState("");
    const {mutate} = useCreateChannel();
    const handleChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value  = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setName(value);   
    }
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        mutate(
            {name, workspaceId},
            {
                onSuccess:(id)=>{
                    router.push(`/workspace/${workspaceId}/channel/${id}`);
                    handleClose();
                    toast.success("Channel created");
                },
                onError:()=>{
                    toast.error("Failed to create channel");
                },
            }
        );
        
    }
    const handleClose = () => {
        setName("");
        setOpen(false);
    };
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add a channel</DialogTitle>
                    {/* <DialogDescription>
                        <p className="text-sm text-muted-foreground">
                            Add a channel
                        </p>
                    </DialogDescription> */}
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={name}
                        disabled={false}
                        onChange={handleChange}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder="e.g. plan-budget"
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={false}
                        >
                            Create
                        </Button>

                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}; 