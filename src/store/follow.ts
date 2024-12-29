import {create} from 'zustand';


interface UserStore {
  following: string[]; 
  followers: string[];
  toggleFollow: (targetUserId: string) => void; 
}

export const useFollowStore = create<UserStore>((set) => ({
  following: [],
  followers: [],
  toggleFollow: (targetUserId: string) => set((state) => {
    const isFollowing = state.following.includes(targetUserId);

 
    if (isFollowing) {
      return {
        following: state.following.filter(id => id !== targetUserId),
      };
    } else {
      return {
        following: [...state.following, targetUserId],
      };
    }
  }),
}));
