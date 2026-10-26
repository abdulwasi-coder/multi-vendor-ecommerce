import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">Unauthorized</h1>
      <p className="max-w-md text-muted-foreground">
        You do not have permission to access this page, or your access token is
        unavailable. Please sign in with an authorized account.
      </p>
      <Link className="text-primary underline underline-offset-4" href="/login">
        Go to login
      </Link>
    </main>
  );
}