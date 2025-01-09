import { create } from 'zustand';
import { api } from '@/libs/api';

interface LikeStore {
  likes: Record<number, number>;
  toggleLike: (threadId: number) => Promise<void>;
  loadLikes: () => Promise<void>;
}

export const useLikeStore = create<LikeStore>((set, get) => {
  const getInitialLikes = () => {
    if (typeof window === 'undefined') return {}; // Hindari akses di server
    try {
      return JSON.parse(localStorage.getItem('likes') || '{}');
    } catch {
      console.error('Invalid localStorage data');
      return {};
    }
  };

  return {
    likes: getInitialLikes(),

  // Menambahkan loadLikes untuk memastikan data backend dan localStorage tergabung dengan benar
// Memperbarui `loadLikes` untuk memuat data like dari backend
loadLikes: async () => {
  try {
    const response = await api.get('/threads/likes');
    const backendLikes = response.data.likes || {}; // Ambil likes dari backend

    // Gabungkan likes dari backend dan localStorage
    const savedLikes = getInitialLikes();
    const combinedLikes = { ...backendLikes, ...savedLikes };

    // Simpan data gabungan ke localStorage
    localStorage.setItem('likes', JSON.stringify(combinedLikes));
    set({ likes: combinedLikes });
  } catch (error) {
    console.error('Error loading likes:', error);
  }
},

// Memperbarui toggleLike agar tidak menghapus like pengguna lain
toggleLike: async (threadId) => {
  try {
    const currentLikeStatus = get().likes[threadId] || 0; // Ambil status like yang ada
    const newLikeStatus = currentLikeStatus === 0 ? 1 : 0; // Toggle like

    const response = await api.post(`/threads/${threadId}/like`, {
      likeStatus: newLikeStatus,
    });

    const updatedLikeStatus = response.data.thread?._count?.likes;

    if (updatedLikeStatus === undefined) {
      throw new Error('Tidak ada data status like dalam respons');
    }

    // Update likes secara global
    set((state) => {
      const updatedLikes = {
        ...state.likes,
        [threadId]: newLikeStatus, // Update status like thread tertentu
      };

      // Perbarui localStorage dengan data terbaru
      localStorage.setItem('likes', JSON.stringify(updatedLikes));
      return { likes: updatedLikes };
    });
  } catch (error) {
    console.error('Error toggling like:', error);
  }
}


    
  };
});
