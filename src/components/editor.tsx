import Quill, { Delta, QuillOptions, Op } from 'quill'
import "quill/dist/quill.snow.css"
import { RefObject, useEffect, useLayoutEffect, useRef } from 'react'
import { Button } from './ui/button'
import { PiTextAa } from 'react-icons/pi'
import { Smile, ImageIcon, XIcon } from 'lucide-react' 
import { MdSend } from 'react-icons/md'
import { Hint } from './hint'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Image from "next/image"

type EditorValue = {
    image: File | null
    body : string
}
interface EditorProps{
    onSubmit:({image, body}:EditorValue)=>void
    onCancel?:()=>void
    placeholder?:string
    defaultValue?:Delta | Op[]
    disabled?:boolean
    innerRef?:RefObject<Quill|null>
    variant?:"create" | "update"
}
const Editor =({
    variant= "create",
    onCancel, 
    onSubmit, 
    placeholder="Write something...",
    defaultValue=[], 
    disabled = false,
    innerRef,
}:EditorProps)=>{
    const submitRef = useRef(onSubmit);
    const placeHolderRef = useRef(placeholder);
    const quillRef = useRef<Quill|null>(null);
    const defaultValueRef = useRef(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const disabledRef = useRef(disabled);
    const imageElementRef = useRef<HTMLInputElement>(null);
    const [text, setText] = useState("")
    const [image, setImage] = useState<File | null>(null)

    useLayoutEffect(()=>{
        submitRef.current = onSubmit;
        placeHolderRef.current = placeholder;
        defaultValueRef.current = defaultValue; 
        disabledRef.current = disabled;
    })

    useEffect(()=>{
        if(!containerRef.current) return
        const container = containerRef.current
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        )
        const options: QuillOptions= {
            theme: 'snow',
            placeholder: placeHolderRef.current,
            modules: {
                toolbar:[
                    ["bold", "italic", "underline", "strike", "link"],
                    [{list: "ordered"}, {list: "bullet"}],
                ],
                keyboard:{
                    bindings:{
                        enter:{
                            key:"Enter",
                            handler:()=>{
                                //TODOD send message
                                return 
                            }
                        },
                        shift_enter:{
                            key:"Enter",
                            shiftKey:true,
                            handler:()=>{
                                quill.insertText(quill.getSelection()?.index || 0, "\n")
                            }
                        }
                    }
                }
            }
        }
        const quill =new Quill(editorContainer, options)
        quillRef.current = quill
        quillRef.current.focus()
        if(innerRef){
            innerRef.current = quill
        }
        quill.setContents(defaultValueRef.current)
        setText(quill.getText())
        quill.on(Quill.events.TEXT_CHANGE, ()=>{
            setText(quill.getText())
        })

        return () => {
            quill.off(Quill.events.TEXT_CHANGE)
            if(container){
                container.innerHTML = ""
            }
            if(quillRef.current){
                quillRef.current = null
            }
            if(innerRef){
                innerRef.current = null
            }
        }

    },[innerRef])
    const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length===0

    return (
        <div className="flex flex-col">
            <input 
                type="file" 
                accept='image/*'
                ref={imageElementRef}
                onChange={(e)=>{
                    setImage(e.target.files![0])
                }}
                className='hidden'
             />
            <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white ">
                <div ref={containerRef} className='h-full ql-custom'/>
                {!!image && (
                    <div className='p-2'>
                        <div className='relative size-[62px] flex justify-center items-center group/image'>
                        <Hint label='Remove image'>
                            <button 
                                onClick={()=>{
                                    setImage(null)
                                    imageElementRef.current!.value = ""
                                }}
                                className='hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center'
                            >
                                <XIcon className='size-4'/>
                            </button>
                            </Hint>
                            <Image 
                                src={URL.createObjectURL(image)}
                                alt="image"
                                fill
                                className='rounded-xl overflow-hidden border object-cover'
                            />
                        </div>
                    </div>
                )}
                <div className='flex px-2 pb-2 z-[5]'>
                    <Hint label='Hide formatting'>
                        <Button
                            disabled={false}
                            size="iconSm"
                            variant={"ghost"}
                            onClick={()=>{
                                console.log("clicked")
                            }}
                        >
                            <PiTextAa className='size-4'/>
                        </Button>
                    </Hint>
                    <Hint label='Emoji'>
                        <Button
                            disabled={false}
                            size="iconSm"
                            variant={"ghost"}
                            onClick={()=>{
                                console.log("clicked")
                            }}
                        >
                            <Smile className='size-4'/>
                        </Button>
                    </Hint>
                    {variant==="create" &&(
                        <Hint label='Image'>
                            <Button
                                disabled={false}
                                size="iconSm"
                                variant={"ghost"}
                                onClick={()=>{
                                    imageElementRef.current?.click()
                                }}
                            >
                                <ImageIcon className='size-4'/>
                            </Button>
                        </Hint>
                    )}
                    {variant==="update" &&(
                        <div className='ml-auto flex items-center gap-x-2'>
                            <Button 
                                variant="outline"
                                size="sm"
                                onClick={()=>{
                                    console.log("clicked")
                                }}
                                disabled={false}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className='bg-[#26366B] hover:bg-[#26366B]/80 text-white'
                                size="sm"
                                onClick={()=>{
                                    console.log("clicked")
                                }}
                                disabled={false}
                            >
                                Save
                            </Button>
                        </div>
                    )}
                    {variant==="create" &&(
                    <Button 
                        disabled={disabled || isEmpty}
                        size="iconSm"
                        onClick={()=>{
                            console.log("clicked")
                        }}
                        className={cn(
                            "ml-auto",
                            isEmpty
                            ?'bg-white hover:bg-white text-muted-foreground'
                            :'bg-[#26366B] hover:bg-[#26366B]/80 text-white'
                        )}
                    >
                        <MdSend className='size-4'/>
                    </Button>
                    )}
                </div>
            </div>
            {variant === "create" && (
                <div className={cn(
                    'p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition',
                    !isEmpty && 'opacity-100'
                )}
                >
                    <p>
                        <strong>Shift + Enter</strong> to add a new line
                    </p>
                </div>
            )}

        </div>
    )
}
export default Editor