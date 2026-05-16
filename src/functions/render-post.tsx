'use server';

import { Text, View } from 'react-native';
import 'server-only';

export async function renderPost() {
  return (
    <View>
      <Text>Post</Text>
    </View>
  );
}
