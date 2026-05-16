import { useEffect } from 'react';

import { ThemedView } from './themed-view';

export function PostList() {
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const response = await fetch('/api/post');
    const data = await response.json();
    console.log('posts', data);
  }

  return <ThemedView></ThemedView>;
}
