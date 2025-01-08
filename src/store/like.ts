import { create } from 'zustand';
import { api } from '@/libs/api'; 
import { toast } from 'react-toastify';

interface LikeStore {
  likes: Record<number, number>;
  toggleLike: (threadId: number) => Promise<void>; 
  loadLikes: () => void; 
}

export const useLikeStore = create<LikeStore>((set, get) => {
  // Memastikan data yang diambil dari localStorage valid
  const savedLikes = (() => {
    try {
      const data = localStorage.getItem('likes');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error parsing likes from localStorage:', error);
      return {}; // Kembalikan objek kosong jika ada error
    }
  })();

  return {
    likes: savedLikes, 
    loadLikes: () => {
      const savedLikes = (() => {
        try {
          const data = localStorage.getItem('likes');
          return data ? JSON.parse(data) : {};
        } catch (error) {
          console.error('Error parsing likes from localStorage:', error);
          return {};
        }
      })();
      set({ likes: savedLikes });
    },
    toggleLike: async (threadId) => {
      try {
        const currentLikeStatus = get().likes[threadId] || 0; 

        // Mengirim request untuk mengubah status like
        const response = await api.post(`/threads/${threadId}/like`, {
          likeStatus: currentLikeStatus === 0 ? 1 : 0,
        });

        // Memeriksa apakah respons sesuai
        if (!response.data?.thread || response.data.thread._count.likes === undefined) {
          throw new Error('Tidak ada data status like dalam respons');
        }

        const updatedLikeStatus = response.data.thread._count.likes;

        // Menggunakan set dengan callback untuk memastikan pembaruan state yang konsisten
        set((state) => {
          const updatedLikes = {
            ...state.likes,
            [threadId]: updatedLikeStatus,
          };

          // Menyimpan likes yang diperbarui ke localStorage
          localStorage.setItem('likes', JSON.stringify(updatedLikes));

          return { likes: updatedLikes };
        });

        toast.success(updatedLikeStatus > 0 ? 'Like berhasil!' : 'Like dihapus!');
      } catch (error) {
        toast.error('Gagal mengubah like.');
        console.error('Error toggling like:', error);
      }
    },
  };
});
