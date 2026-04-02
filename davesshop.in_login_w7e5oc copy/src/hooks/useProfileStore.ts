// Profile is now embedded in the User object from authStore — no SDK needed
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../store/authStore';

export function useProfileStore() {
  const { user, refreshUser } = useAuth();

  const profile = user
    ? {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        rebrandAccess: user.rebrandAccess,
        redeemedKeys: user.redeemedKeys,
        email: user.email,
        createdAt: user.createdAt,
      }
    : null;

  const update = (userId: string, updates: { isAdmin?: boolean; rebrandAccess?: boolean; redeemedKeys?: string[] }) => {
    updateUser(userId, updates);
    refreshUser();
  };

  return { profile, isPending: false, update };
}
