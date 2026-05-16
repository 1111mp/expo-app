import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { withUniwind } from 'uniwind';

const StyledNativeTabsBase = withUniwind(NativeTabs);

export const StyledNativeTabs = Object.assign(StyledNativeTabsBase, {
  Trigger: NativeTabs.Trigger,
  BottomAccessory: NativeTabs.BottomAccessory,
});
