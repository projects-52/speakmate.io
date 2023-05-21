import { Outlet } from '@remix-run/react';

import type { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });
  return { user };
};

export default function App() {
  return (
    <>
      <div className="flex h-screen">
        <main className="bg-white flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
}
