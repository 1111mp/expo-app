import { StyledNativeTabs } from '@/components';

export default function TabsLayout() {
  return (
    <>
      <StyledNativeTabs
        minimizeBehavior='onScrollDown'
        backgroundColorClassName='accent-white dark:accent-black'
        indicatorColorClassName='accent-[#F0F0F3] dark:accent-[#212225]'
        labelClassName='aria-selected:accent-black dark:aria-selected:accent-white'
      >
        <StyledNativeTabs.Trigger name='(home)'>
          <StyledNativeTabs.Trigger.Label>Home</StyledNativeTabs.Trigger.Label>
          <StyledNativeTabs.Trigger.Icon
            src={require('@/assets/images/tabIcons/home.png')}
            renderingMode='template'
          />
        </StyledNativeTabs.Trigger>

        <StyledNativeTabs.Trigger name='explore'>
          <StyledNativeTabs.Trigger.Label>
            Explore
          </StyledNativeTabs.Trigger.Label>
          <StyledNativeTabs.Trigger.Icon
            src={require('@/assets/images/tabIcons/explore.png')}
            renderingMode='template'
          />
        </StyledNativeTabs.Trigger>
      </StyledNativeTabs>
    </>
  );
}
