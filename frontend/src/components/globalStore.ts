'use client';

import { useUserStore } from '@/store/userStore';

/**
 * Wrapper around the shared user store so legacy components can keep using
 * `globalStore` without being aware of the underlying Zustand hook.
 */
export const globalStore = useUserStore;

export type GlobalStoreState = ReturnType<typeof useUserStore>;
