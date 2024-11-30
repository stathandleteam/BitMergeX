export const ROUTES = {
  AppUX: '/app-ux',
  HOME: '/home',
  ONBOARDING: '/onboarding',
  SIGNUP: '/signup',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  SEED_PHRASE_CREATE: '/seed-phrase-create',
  SEED_PHRASE_RECOVER: '/seed-phrase-recover',
  SEED_PHRASE_CONFIRM: '/seed-phrase-confirm',
  PASSWORD_SECURITY: '/password-security',
  WALLET_CREATED: '/wallet-created',
  RECOVERY_STEP_ONE: '/recovery_step_one'
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type Routes = typeof ROUTES[RouteKeys];