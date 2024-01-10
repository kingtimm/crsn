import { withClerkMiddleware } from 'h3-clerk'

export default withClerkMiddleware({
  adjustProtoHeaderInDev: true,
  // publishableKey: useRuntimeConfig().public.clerkPublishableKey,
  // secretKey: useRuntimeConfig().clerkSecretKey,
  // onError: error => console.log(error),
})
