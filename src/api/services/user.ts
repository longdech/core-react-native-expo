import { createQueryKeys } from '@/external/bridge';
import { defineService } from '@/api/client';
import { User } from '@/types/models/user';

export const userKeys = createQueryKeys('users');
export const userService = defineService<User>('/users', userKeys);
