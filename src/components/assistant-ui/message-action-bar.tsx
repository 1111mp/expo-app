import { ActionBarPrimitive } from '@assistant-ui/react-native';
import * as Clipboard from 'expo-clipboard';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

import { StyledIonicons } from '../styled-ionicons';

const StyledActionBarCopy = withUniwind(ActionBarPrimitive.Copy);
const StyledActionBarReload = withUniwind(ActionBarPrimitive.Reload);

export function MessageActionBar() {
  return (
    <View className='flex-row gap-1 mt-1'>
      <StyledActionBarCopy
        className='p-1.5 rounded-lg'
        copyToClipboard={async (text) => {
          await Clipboard.setStringAsync(text);
        }}
      >
        {({ isCopied }) => (
          <StyledIonicons
            name={isCopied ? 'checkmark' : 'copy-outline'}
            size={16}
            colorClassName={
              isCopied ? 'accent-primary' : 'accent-muted-foreground'
            }
          />
        )}
      </StyledActionBarCopy>
      <StyledActionBarReload className='p-1.5 rounded-lg'>
        <StyledIonicons
          name='refresh-outline'
          size={16}
          colorClassName='accent-muted-foreground'
        />
      </StyledActionBarReload>
    </View>
  );
}
