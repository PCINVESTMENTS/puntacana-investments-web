import useSWR from 'swr';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useProperties() {
    const { data, error, isLoading } = useSWR(
        API_URL ? `${API_URL}/api/public/properties/` : null,
        fetcher
    );

    return {
        properties: data,
        isLoading,
        isError: error
    };
}
