import {
  AssistantRuntimeProvider,
  Tools,
  useAui,
} from '@assistant-ui/react-native';
import { Stack, useRouter } from 'expo-router';

import { ProfileButton } from '@/components';
import { Thread } from '@/components/assistant-ui';
import { expoToolkit } from '@/components/assistant-ui/tools';
import { useAppRuntime } from '@/hooks/use-app-runtime';

export default function AssistantScreen() {
  const router = useRouter();
  const runtime = useAppRuntime();
  const aui = useAui({
    tools: Tools({ toolkit: expoToolkit }),
  });

  return (
    <>
      <Stack.Toolbar placement='right'>
        <Stack.Toolbar.Menu icon='ellipsis'>
          <Stack.Toolbar.MenuAction icon='square.and.arrow.up'>
            Export Orders
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon='printer'>
            Print Report
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon='arrow.clockwise'>
            Refresh
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>

        <Stack.Toolbar.Menu icon='line.3.horizontal.decrease'>
          <Stack.Toolbar.Menu inline title='Status'>
            <Stack.Toolbar.MenuAction isOn>All Orders</Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction>Pending</Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction>Fulfilled</Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction>Cancelled</Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
          <Stack.Toolbar.Menu inline title='Sort By'>
            <Stack.Toolbar.MenuAction isOn>Date</Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction>Amount</Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction>Customer</Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>

        <Stack.Toolbar.View separateBackground>
          <ProfileButton
            onPress={() => {
              router.dismissTo('/explore');
            }}
          />
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <AssistantRuntimeProvider runtime={runtime} aui={aui}>
        <Thread />
      </AssistantRuntimeProvider>
    </>
  );
}
