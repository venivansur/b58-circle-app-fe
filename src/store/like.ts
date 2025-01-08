import { create } from 'zustand';
import { api } from '@/libs/api';

interface LikeStore {
  likes: Record<number, number>;
  toggleLike: (threadId: number) => Promise<void>;
  loadLikes: () => Promise<void>;
}

export const useLikeStore = create<LikeStore>((set, get) => {
  return {
    likes: JSON.parse(localStorage.getItem('likes') || '{}'),

    loadLikes: async () => {
      try {
        const response = await api.get('/threads/likes');
        const backendLikes = response.data.likes || {};

        const savedLikes = JSON.parse(localStorage.getItem('likes') || '{}');
        const combinedLikes = { ...backendLikes, ...savedLikes };

        localStorage.setItem('likes', JSON.stringify(combinedLikes));
        set({ likes: combinedLikes });
      } catch (error) {
        console.error('Error loading likes:', error);
      }
    },

    toggleLike: async (threadId) => {
      try {
        const currentLikeStatus = get().likes[threadId] || 0;
        const response = await api.post(`/threads/${threadId}/like`, {
          likeStatus: currentLikeStatus === 0 ? 1 : 0,
        });

        const updatedLikeStatus = response.data.thread?._count.likes;

        if (updatedLikeStatus === undefined) {
          throw new Error('Tidak ada data status like dalam respons');
        }

        set((state) => {
          const updatedLikes = {
            ...state.likes,
            [threadId]: updatedLikeStatus,
          };

          localStorage.setItem('likes', JSON.stringify(updatedLikes));
          return { likes: updatedLikes };
        });
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    },
  };
});
