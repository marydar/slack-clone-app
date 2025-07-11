import { Id, Doc } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { format, isYesterday, isToday, set } from "date-fns";
import { Hint } from "./hint";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "../features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { use } from "react";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { usePanel } from "@/hooks/use-panel";
import { Threadbar } from "./thread-bar";

const Renderer = dynamic(() => import("@/components/renderer"),{ssr:false})
const Editor = dynamic(() => import("@/components/editor"),{ssr:false})
const formatFullTime = (date:Date)=>{
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "hh:mm:ss a")}`
}

interface MessageProps{
    id : Id<"messages">
    memberId : Id<"members">
    authorImage?:string
    authorName?:string
    isAuthor?:boolean
    // reactions: Array<
    //     Omit<Doc<"reactions">, "memberId"> & {
    //         count:number
    //         memberIds : Id<"members">[]
    //     }
    // >
    body: Doc<"messages">["body"]
    image:string | null | undefined
    createdAt:Doc<"messages">["_creationTime"]
    updatedAt:Doc<"messages">["updatedAt"]
    isEditing:boolean
    isCompact?:boolean
    setEditingId:(id:Id<"messages"> | null)=>void
    hideThreadButton?:boolean
    threadCount?:number
    threadImage?:string
    threadName?:string
    threadTimeStamp?:number
}

export const Message = ({
    id,
    memberId,
    authorImage,
    authorName = "Member",
    isAuthor,
    // reactions,
    body,
    image,
    createdAt,
    updatedAt,
    isEditing,
    isCompact,
    setEditingId,
    hideThreadButton,
    threadCount,
    threadImage,
    threadName,
    threadTimeStamp,
}: MessageProps) => {

    const {mutate: updateMessage, isPending: isUpdatingMessage} = useUpdateMessage();
    const {mutate: removeMessage, isPending: isRemovingMessage} = useRemoveMessage();
    const {parentMessageId, onOpenMessage, onCloseMessage}= usePanel()
    const isPending = isUpdatingMessage
    const handleUpdate = ({body}:{body:string})=>{
        updateMessage({messageId:id, body},{
            onSuccess:()=>{
                toast.success("Message updated")
                setEditingId(null)
            },
            onError:()=>{
                toast.error("Failed to update message")
            },
        })
    }
    const handleRemove =async ()=>{ 
        await removeMessage({messageId:id},{
            onSuccess:()=>{
                toast.success("Message removed")
                if(parentMessageId === id){
                    onCloseMessage()
                }
            },
            onError:()=>{
                toast.error("Failed to remove message")
            },
        })  
    }
    if(isCompact){
        return (
            <div className={cn(
                "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group  relative ",
                isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200 ease-in-out"
            )}>
                
                <div className="flex items-start">
                    <Hint label={formatFullTime(new Date(createdAt))}>
                        <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                            {format(new Date(createdAt), "hh:mm")}
                        </button>
                    </Hint>
                    {isEditing ?(
                        <div className="w-full h-full">
                            <Editor
                                onSubmit={handleUpdate}
                                disabled={isUpdatingMessage}
                                defaultValue={JSON.parse(body)}
                                onCancel={()=>{setEditingId(null)}}
                                variant="update"
                            />
                        </div>
                    ):
                        <div className="flex flex-col w-full">
                            <Renderer value={body}/> 
                            <Thumbnail url={image}/>
                            {updatedAt ? (
                                <span className="text-xs text-muted-foreground">(edited)</span>
                            )   : null }
                            <Threadbar
                                count={threadCount}
                                image={threadImage}
                                name={threadName}
                                timeStamp={threadTimeStamp}
                                onClick={()=>onOpenMessage(id)}
                            />
                        </div>
                    }
                </div>
                {!isEditing && (
                    <Toolbar
                        isAuthor={isAuthor}
                        isPending={false}
                        handleEdit={()=>{setEditingId(id)}}
                        handleThread={()=>onOpenMessage(id)}
                        handleDelete={handleRemove}
                        handleReaction={()=>{}}
                        hideThreadButton={hideThreadButton}
                    />
                )}
            </div>
        )
    }
    const avatarFallback = authorName.charAt(0).toUpperCase()
    return (
        <div className={cn(
                "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group  relative ",
                isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200 ease-in-out"
            )}>
                <div className="flex items-start gap-2">
                    <button>
                        <Avatar>
                            <AvatarImage src={authorImage} alt="Author"/>
                            <AvatarFallback className="bg-red-800 text-white text-sm">
                                {avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {isEditing ?(
                        <div className="w-full h-full">
                            <Editor
                                onSubmit={handleUpdate}
                                disabled={isUpdatingMessage}
                                defaultValue={JSON.parse(body)}
                                onCancel={()=>{setEditingId(null)}}
                                variant="update"
                            />
                        </div>
                    ):
                        <div className="flex flex-col w-full overflow-hidden">
                            <div className="text-sm">
                                <button className="font-bold text-primary hover:underline " onClick={()=>{}}> 
                                    {authorName}
                                </button>
                                <span>
                                    &nbsp;&nbsp;
                                </span>
                                <Hint label={formatFullTime(new Date(createdAt))}>
                                    <button className="text-xs text-muted-foreground hover:underline">
                                        {format(new Date(createdAt), "hh:mm a")}
                                    </button>
                                </Hint>
                            </div>
                            <Renderer value={body}/>
                            <Thumbnail url={image}/>
                            {updatedAt ? (
                                <span className="text-xs text-muted-foreground">(edited)</span>
                            ) : null }
                            <Threadbar
                                count={threadCount}
                                image={threadImage}
                                name={threadName}
                                timeStamp={threadTimeStamp}
                                onClick={()=>onOpenMessage(id)}
                            />
                        </div>
                    }
                </div> 
                {!isEditing && (
                    <Toolbar
                        isAuthor={isAuthor}
                        isPending={false}
                        handleEdit={()=>{setEditingId(id)}}
                        handleThread={()=>onOpenMessage(id)}
                        handleDelete={handleRemove}
                        handleReaction={()=>{}}
                        hideThreadButton={hideThreadButton}
                    />
                )}
            </div>
    )
}