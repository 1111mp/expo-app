import { expo } from '@better-auth/expo';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth, type SocialProviders } from 'better-auth';
import jwt from 'jsonwebtoken';

import { db } from '@/server/db';

const getSocialProviders = () => {
  const providers: SocialProviders = {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  };

  const isAppleConfigured = !!(
    process.env.APPLE_CLIENT_ID &&
    process.env.APPLE_TEAM_ID &&
    process.env.APPLE_KEY_ID &&
    process.env.APPLE_PRIVATE_KEY
  );
  if (isAppleConfigured) {
    providers.apple = {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: generateAppleClientSecret(
        process.env.APPLE_CLIENT_ID!,
        process.env.APPLE_TEAM_ID!,
        process.env.APPLE_KEY_ID!,
        process.env.APPLE_PRIVATE_KEY!,
      ),
      appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER as string,
    };
  }

  return providers;
};

export const auth = betterAuth({
  baseURL: 'http://localhost:8081',
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [expo()],
  socialProviders: getSocialProviders(),
  trustedOrigins: [
    'expoapp://',
    'withbetterauth://',
    'https://appleid.apple.com',
  ],
});

// Generate the client secret JWT required for 'Sign in with Apple'.
function generateAppleClientSecret(
  clientId: string,
  teamId: string,
  keyId: string,
  privateKey: string,
) {
  return jwt.sign({}, privateKey, {
    algorithm: 'ES256',
    keyid: keyId,
    issuer: teamId,
    audience: 'https://appleid.apple.com',
    subject: clientId,
    expiresIn: '180d',
  });
}
