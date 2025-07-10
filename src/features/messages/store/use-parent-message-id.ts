import {useQueryState} from 'nuqs'
// import { useQueryState } from 'nuqs/next-app';

export const useParentMessageId = ()=>{
    return useQueryState("parentMessageId")
}