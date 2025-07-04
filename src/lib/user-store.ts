
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface UserState {
  users: User[];
  addUser: (userData: Omit<User, 'id'>) => void;
  findUserByEmail: (email: string) => User | undefined;
}

const initialUsers: User[] = [
    {
        id: 'user-0',
        name: 'Shop Owner',
        email: 'owner@stitch.link',
        password: 'password123'
    }
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      addUser: (userData) => {
        set((state) => ({
          users: [
            ...state.users,
            {
              ...userData,
              id: `user-${Date.now()}`,
            },
          ],
        }));
      },
      findUserByEmail: (email: string) => {
          return get().users.find(user => user.email === email);
      }
    }),
    {
      name: 'stitchlink-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
