import {useQueryState} from 'nuqs'
// import { useQueryState } from 'nuqs/next-app';

export const useProfileMemberId = ()=>{
    return useQueryState("profileMemberId")
}