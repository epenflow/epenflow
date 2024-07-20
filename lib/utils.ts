import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export async function _request<K>(option: AxiosRequestConfig): Promise<K> {
	const onSuccess = (response: AxiosResponse) => {
		const { data } = response;
		return data.data;
	};
	const onError = (error: AxiosError) => {
		return {
			message: error.message,
			code: error.code,
			response: error.response,
		};
	};
	return axios(option).then(onSuccess).catch(onError);
}
export const clientQuery = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});
