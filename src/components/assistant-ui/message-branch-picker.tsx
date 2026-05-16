import { BranchPickerPrimitive, useAuiState } from '@assistant-ui/react-native';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

import { ThemedText } from '@/components';
import { StyledIonicons } from '../styled-ionicons';

const StyledBranchPickerPrevious = withUniwind(BranchPickerPrimitive.Previous);
const StyledBranchPickerNext = withUniwind(BranchPickerPrimitive.Next);

export function MessageBranchPicker() {
  const branchNumber = useAuiState((s) => s.message.branchNumber);
  const branchCount = useAuiState((s) => s.message.branchCount);

  if (branchCount <= 1) return null;

  return (
    <View className='flex-row items-center gap-0.5'>
      <StyledBranchPickerPrevious className='p-1 rounded-md'>
        <StyledIonicons
          name='chevron-back'
          size={14}
          colorClassName={
            branchNumber <= 1
              ? 'accent-muted-foreground'
              : 'accent-secondary-foreground'
          }
        />
      </StyledBranchPickerPrevious>
      <ThemedText className='text-xs tabular-nums'>
        {branchNumber} / {branchCount}
      </ThemedText>
      <StyledBranchPickerNext className='p-1 rounded-md'>
        <StyledIonicons
          name='chevron-forward'
          size={14}
          colorClassName={
            branchNumber >= branchCount
              ? 'accent-muted-foreground'
              : 'accent-secondary-foreground'
          }
        />
      </StyledBranchPickerNext>
    </View>
  );
}
