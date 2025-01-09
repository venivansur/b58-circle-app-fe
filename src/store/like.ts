import { create } from 'zustand';
import { api } from '@/libs/api';

interface LikeStore {
  likes: Record<number, number>;
  toggleLike: (threadId: number) => Promise<void>;
}

export const useLikeStore = create<LikeStore>((set, get) => {
  return {
    likes: {}, 

    toggleLike: async (threadId) => {
      try {
        const currentLikeStatus = get().likes[threadId] || 0;
        const newLikeStatus = currentLikeStatus === 0 ? 1 : 0;
    
        // Log before updating
        console.log('Current like status:', currentLikeStatus, 'New like status:', newLikeStatus);
    
        const response = await api.post(`/threads/${threadId}/like`, {
          likeStatus: newLikeStatus,
        });
    
        const updatedLikeStatus = response.data.thread?._count?.likes;
    
        if (updatedLikeStatus === undefined) {
          throw new Error('Tidak ada data status like dalam respons');
        }
    
        // Log after updating
        console.log('Updated like status:', updatedLikeStatus);
    
        set((state) => {
          const updatedLikes = {
            ...state.likes,
            [threadId]: updatedLikeStatus,
          };
          return { likes: updatedLikes };
        });
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    }
  };
});
