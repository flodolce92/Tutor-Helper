import {
  FORTY_TWO_SCHOOL_CLIENT_ID,
  FORTY_TWO_SCHOOL_CLIENT_SECRET,
  AUTH_SECRET,
} from "$env/static/private"
import { SvelteKitAuth } from "@auth/sveltekit"
import FortyTwo from "@auth/sveltekit/providers/42-school"

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    FortyTwo({
      clientId: FORTY_TWO_SCHOOL_CLIENT_ID,
      clientSecret: FORTY_TWO_SCHOOL_CLIENT_SECRET,
    }),
  ],
  secret: AUTH_SECRET,
  trustHost: true,
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 giorni
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // Login iniziale
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 2 * 60 * 60 * 1000
      } else if (token.expiresAt && Date.now() < (token.expiresAt as number) - 5 * 60 * 1000) {
        // Token ancora valido (controllato 5 minuti prima della scadenza)
        return token
      } else if (token.refreshToken) {
        // Token scaduto o in scadenza, esegui il refresh
        try {
          const response = await fetch("https://api.intra.42.fr/oauth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string,
              client_id: FORTY_TWO_SCHOOL_CLIENT_ID,
              client_secret: FORTY_TWO_SCHOOL_CLIENT_SECRET,
            }).toString(),
          })

          if (!response.ok) {
            throw new Error("Token refresh failed")
          }

          const tokens = await response.json()
          token.accessToken = tokens.access_token
          token.refreshToken = tokens.refresh_token ?? token.refreshToken
          token.expiresAt = tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : Date.now() + 2 * 60 * 60 * 1000
        } catch (error) {
          console.error("Errore nel refresh del token:", error)
          return null
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.accessToken = token.accessToken
        session.user.refreshToken = token.refreshToken
      }
      return session
    },
  },
})
