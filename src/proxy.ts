import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next.js internals and files with an extension (icons, images).
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
