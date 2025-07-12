/* eslint-disable @next/next/no-img-element */
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
interface ThumbnailProps{
    url:string | null | undefined
}

export const Thumbnail = ({url}:ThumbnailProps)=>{
    if(!url) return null
    return (
        <Dialog>
            <DialogTrigger >
                <div className="relative overflow-hidden rounded-lg max-w-[360px] border my-2 cursor-zoom-in">
                    <img
                        src={url}
                        alt="Message image"
                        className="object-cover size-full rounded-md"
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none ">
                <img
                    src={url}
                    alt="Message image"
                    className="object-cover w-full h-full rounded-md"
                />
            </DialogContent>
        </Dialog>
        
    )
}