import { useState } from 'react';
import { ScrollView } from 'react-native';

import { SignInForm, SignUpForm, TabKey } from '@/components/forms';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@/components/ui';

export default function LoginScreen() {
  const [tab, setTab] = useState<TabKey>(TabKey.SignInForm);

  const onChangeTab = (value: TabKey) => {
    setTab(value);
  };

  return (
    <ScrollView
      className='flex-1 bg-background'
      contentContainerClassName='min-h-full p-safe landscape:pt-6'
    >
      <Tabs
        value={tab}
        className='w-full max-w-2xl mx-auto mt-4'
        onValueChange={(value) => {
          setTab(value as TabKey);
        }}
      >
        <TabsList className='max-sm:ml-6'>
          <TabsTrigger value={TabKey.SignInForm}>
            <Text>Sign In</Text>
          </TabsTrigger>
          <TabsTrigger value={TabKey.SignUpForm}>
            <Text>Sign Up</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value={TabKey.SignInForm}>
          <SignInForm onChangeTab={onChangeTab} />
        </TabsContent>
        <TabsContent value={TabKey.SignUpForm}>
          <SignUpForm onChangeTab={onChangeTab} />
        </TabsContent>
      </Tabs>
    </ScrollView>
  );
}
