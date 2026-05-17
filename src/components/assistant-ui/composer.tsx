import {
  AttachmentPrimitive,
  ComposerPrimitive,
  useAui,
  useAuiState,
} from '@assistant-ui/react-native';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import { StyledImage, StyledIonicons, ThemedView } from '@/components';
import { cn } from '@/lib/utils';

const StyledComposerInput = withUniwind(ComposerPrimitive.Input);
const StyledComposerCancel = withUniwind(ComposerPrimitive.Cancel);
const StyledComposerSend = withUniwind(ComposerPrimitive.Send);

function AttachmentPreview() {
  const attachment = useAuiState((s) => s.attachment);
  if (!attachment) return null;

  // Find image content for preview URI
  const imageContent = attachment.content?.find((c: any) => c.type === 'image');
  const uri = (imageContent as any)?.image;

  return (
    <AttachmentPrimitive.Root className='relative'>
      {uri ? (
        <StyledImage className='size-15 rounded-lg' source={{ uri }} />
      ) : null}
      <AttachmentPrimitive.Remove className='absolute -top-1.5 -right-1.5'>
        <StyledIonicons
          name='close-circle'
          size={20}
          colorClassName='accent-destructive'
        />
      </AttachmentPrimitive.Remove>
    </AttachmentPrimitive.Root>
  );
}

export function Composer() {
  const aui = useAui();
  const attachmentsCount = useAuiState((s) => s.composer.attachments.length);
  const canCancel = useAuiState((s) => s.composer.canCancel);
  const canSend = useAuiState(
    (s) => !s.thread.isRunning && s.composer.isEditing && !s.composer.isEmpty,
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      base64: true,
    });

    if (result.canceled) return;

    for (const asset of result.assets) {
      // Force JPEG mime type — iOS may report HEIC which OpenAI doesn't support
      const dataUrl = `data:image/jpeg;base64,${asset.base64}`;

      await aui.composer().addAttachment({
        name: asset.fileName ?? 'image.jpg',
        contentType: 'image/jpeg',
        type: 'image',
        content: [{ type: 'image', image: dataUrl }],
      });
    }
  };

  return (
    <ThemedView className='px-4 py-2'>
      {attachmentsCount > 0 && (
        <View className='flex-row flex-wrap gap-2 pb-2'>
          <ComposerPrimitive.Attachments>
            {() => <AttachmentPreview />}
          </ComposerPrimitive.Attachments>
        </View>
      )}
      <View className='flex-row items-center p-1.5 border rounded-2xl bg-input border-border'>
        <Pressable
          className='justify-center items-center size-7.5'
          onPress={pickImage}
          disabled={canCancel}
        >
          <StyledIonicons
            name='add-circle-outline'
            size={24}
            colorClassName='accent-foreground'
          />
        </Pressable>

        <StyledComposerInput
          className='flex-1 w-30 max-h-30 px-1 py-2 text-base leading-5 self-center web:outline-none'
          placeholder='Message...'
          placeholderTextColorClassName='accent-muted-foreground'
          multiline
          maxLength={4000}
          editable={!canCancel}
        />
        {canCancel ? (
          <StyledComposerCancel className='justify-center items-center size-7.5 ml-1.5 rounded-full bg-destructive'>
            <View className='size-3 rounded-xs bg-white' />
          </StyledComposerCancel>
        ) : (
          <StyledComposerSend
            className={cn(
              'justify-center items-center size-7.5 ml-1.5 rounded-full',
              canSend ? 'bg-primary' : 'bg-primary/60',
            )}
          >
            <StyledIonicons
              name='arrow-up'
              size={20}
              colorClassName='accent-primary-foreground'
            />
          </StyledComposerSend>
        )}
      </View>
    </ThemedView>
  );
}
