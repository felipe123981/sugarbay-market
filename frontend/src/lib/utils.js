import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/files`
  : '/api/files';

export function getProductImage(product, fallback = null) {
	if (product?.photos && product.photos.length > 0) {
		return `${IMAGE_BASE_URL}/${product.photos[0]}`;
	}
	return fallback || '/placeholder.svg';
}

export function getAllProductImages(product) {
	if (product?.photos && product.photos.length > 0) {
		return product.photos.map(photo => `${IMAGE_BASE_URL}/${photo}`);
	}
	return [];
}
