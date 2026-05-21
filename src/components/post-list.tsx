import { useSuspenseQuery } from '@tanstack/react-query';

import { useApi } from '@/trpc/react';
import { ThemedView } from './themed-view';

export function PostList() {
  const api = useApi();
  const { data: posts } = useSuspenseQuery(api.post.getPosts.queryOptions());
  console.log('posts', posts);

  return <ThemedView></ThemedView>;
}
