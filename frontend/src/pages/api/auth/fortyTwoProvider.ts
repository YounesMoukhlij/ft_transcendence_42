import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface FortyTwoProfile {
  id: number;
  email: string;
  login: string;
  displayname: string;
  image_url: string;
}

export default function FortyTwoProvider<P extends FortyTwoProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: '42-school',
    name: '42',
    type: 'oauth',
    wellKnown: 'https://api.intra.42.fr/.well-known/openid-configuration',
    authorization: {
      url: 'https://api.intra.42.fr/oauth/authorize',
      params: { scope: 'public' },
    },
    token: 'https://api.intra.42.fr/oauth/token',
    userinfo: 'https://api.intra.42.fr/v2/me',
    profile(profile) {
      return {
        id: profile.id,
        name: profile.displayname,
        email: profile.email,
        image: profile.image_url,
      };
    },
    options,
  };
}
