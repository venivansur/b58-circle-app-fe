import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LikeStore {
  likes: Record<number, boolean>;
  toggleLike: (postId: number) => void;
}

export const useLikeStore = create(
  persist<LikeStore>(
    (set) => ({
      likes: {},
      toggleLike: (postId: number) =>
        set((state) => ({
          likes: {
            ...state.likes,
            [postId]: !state.likes[postId],
          },
        })),
    }),
    {
      name: 'like-storage',
    }
  )
);
