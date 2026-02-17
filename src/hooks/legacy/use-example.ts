import { useQuery } from '@tanstack/react-query';

interface ExampleData {
  id: string;
  name: string;
}

export function useExample() {
  return useQuery<ExampleData[]>({
    queryKey: ['example'],
    queryFn: async () => {
      const res = await fetch('/api/example');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

