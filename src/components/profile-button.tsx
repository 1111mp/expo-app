import { Pressable, PressableProps } from 'react-native';

import { StyledImage } from './styled-image';

export function ProfileButton({ onPress }: Pick<PressableProps, 'onPress'>) {
  return (
    <Pressable onPress={onPress}>
      <StyledImage
        className='size-9 rounded-full'
        source={require('@/assets/images/evanbacon.avif')}
      />
    </Pressable>
  );
}
