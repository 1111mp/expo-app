import { requestHeaders } from 'expo-server';
import { cache } from 'react';

import { auth } from './config';

export const getSession = cache(() =>
  auth.api.getSession({ headers: requestHeaders() }),
);
