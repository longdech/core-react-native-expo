import { createQueryKeys } from '@/external/bridge';
import { defineService } from '@/api/client';
import { Product } from '@/types/models/product';

export const productKeys = createQueryKeys('products');
export const productService = defineService<Product>('/products', productKeys);
