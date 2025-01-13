import { useEffect } from 'react';
export type OAuthProvider = 'google' | 'github' | 'microsoft' | 'facebook' | 'notion';

export const OAuthProviderPatterns: Record<OAuthProvider, string[]> = {
  google: ['google', 'accounts.google.com'],
  github: ['github', 'github.com'],
  microsoft: ['microsoft', 'login.microsoftonline.com'],
  facebook: ['facebook', 'facebook.com'],
  notion: ['notion', 'notion.com']
};

export interface PostMessageData {
  type: string;
  data: string;
  provider?: OAuthProvider;
}

export function DetermineProvider(url: string): OAuthProvider | undefined {
  for (const [provider, patterns] of Object.entries(OAuthProviderPatterns)) {
    if (patterns.some((pattern) => url.includes(pattern))) {
      return provider as OAuthProvider;
    }
  }
  return undefined;
}

export function OAuthCallBack() {
  useEffect(() => {
    if (!window.opener) return;

    const provider = DetermineProvider(window.location.href.toLowerCase());
    if (!provider) {
      console.error('ERROR not accepted aouth provider');
      return;
    }

    const data: PostMessageData = {
      type: 'oauthmessage',
      data: window.location.search,
      provider: provider,
    };

    window.opener.postMessage(data);
    window.close();
  });
  return <></>;
}
