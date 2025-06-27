"use client";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useCreateWorkspace } from "../api/use-create-workspace";
import React from "react";
import { useState } from "react";
export const CreateWorkspaceModal = () => {
    const [open, setOpen] = useCreateWorkspaceModal();
    const {mutate, isPending} = useCreateWorkspace()
    const [name, setName] = useState("");
    const handleClose = () => {
        // setOpen(false);
    }
    const handleSubmit=async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({name},{
            onSuccess(data) {
                console.log(data)
            },
        })
        // try {
        //     const data = await mutate({
        //         name:"workspace 1",
        //     },{
        //         onSuccess(data){
        //         //redirect to workspace
        //         },
        //         onError(error){
        //         //show toast
        //         },
        //         onSettled(){
        //         // resetForm
        //         }
        //     })
        // } catch (error) {
            
        // }
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                    required
                    autoFocus
                    minLength={3}
                    placeholder="workspace name e.g. 'work' 'home' 'personal'"
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>       
    )
}