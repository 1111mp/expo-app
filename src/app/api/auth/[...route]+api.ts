import { auth } from '@/lib/better-auth/server';

const handler = auth.handler;
export { handler as GET, handler as POST };
