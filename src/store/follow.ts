import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';
interface FollowState {
  followers: User[]; 
  following: User[]; 
  suggestedUsers: Array<any>; 
  setFollowers: (users: User[]) => void; 
  setFollowing: (users: User[]) => void; 
  setSuggestedUsers: (users: User[]) => void; 
  toggleFollow: (userId: string, isFollowed: boolean) => void; 
}

export const useFollowStore = create(
  persist<FollowState>(
    (set) => ({
      followers: [], 
      following: [], 
      suggestedUsers: [],


      setFollowers: (users) => set({ followers: users }),

      setFollowing: (users) => set({ following: users }),

      setSuggestedUsers: (users) => set({ suggestedUsers: users }),

    
      toggleFollow: (userId, isFollowed) =>
        set((state) => {
          const updatedFollowing = isFollowed
            ? state.following.filter((user) => user.id !== userId) 
            : [...state.following, { id: userId, isFollowed } as User];
      
          return {
            ...state,
            following: updatedFollowing,
            suggestedUsers: state.suggestedUsers.map((user) =>
              user.id === userId ? { ...user, isFollowed: !isFollowed } : user
            ),
          };
        }),
      
    }),
    {
      name: 'follow-storage', 
    }
  )
);
