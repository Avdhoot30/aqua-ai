import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/forgot-password/sent",
  "/auth/reset-password",
];

const CRON_PATHS = [
  "/api/cron/hydration-reminders",
];

export async function proxy(
  request: NextRequest,
) {
  const pathname =
    request.nextUrl.pathname;

  // --------------------------------------------------
  // Cron/API endpoints that have their own authentication
  // must bypass normal browser-session authentication.
  // --------------------------------------------------

  if (
    CRON_PATHS.some(
      (path) =>
        pathname === path,
    )
  ) {
    return NextResponse.next();
  }

  const isPublic =
    PUBLIC_PATHS.some(
      (path) =>
        pathname === path ||
        pathname.startsWith(
          `${path}/`,
        ),
    );

  let response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,
      process.env
        .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(
            cookiesToSet,
          ) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) => {
                request.cookies.set(
                  name,
                  value,
                );
              },
            );

            response =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                response.cookies.set(
                  name,
                  value,
                  options,
                );
              },
            );
          },
        },
      },
    );

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user && !isPublic) {
    const loginUrl =
      new URL(
        "/auth/login",
        request.url,
      );

    loginUrl.searchParams.set(
      "redirect",
      pathname,
    );

    return NextResponse.redirect(
      loginUrl,
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run proxy for application routes,
     * excluding Next internals and static files.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};