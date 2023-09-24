import { useEffect } from "react";
import { create } from "zustand";
import { get, set } from "local-storage";


export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  isAnonymous: boolean;
}

function getUserId(): string {
  const userId = get<string>("userId");

  if (userId) {
    return userId;
  }

  const newUserId = Math.random().toString(36).substring(7);
  set("userId", newUserId);
  return newUserId;
}

export const useUserStore = create<User>((_set, _get) => ({
  id: getUserId(),
  username: "",
  avatarUrl: "",
  isAnonymous: true,
}));

export const useInitializeUserStore = (user: User) => {
  useEffect(() => {
    useUserStore.setState((userStore) => ({
      ...userStore,
      ...user,
    }));
  }, [user]);
};

export const updateUserInStore = async () => {
  // const user = await fetchUser();
  // useUserStore.setState((userStore) => ({
  //   ...userStore,
  //   ...user,
  // }));
};
