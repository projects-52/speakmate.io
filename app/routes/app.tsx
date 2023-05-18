import { Outlet, useLoaderData } from '@remix-run/react';
import {
  HomeIcon,
  Cog6ToothIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { NavLink, useLocation } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/services/auth.service';

const navigation = [
  {
    name: 'navigation.home',
    href: '/app/dashboard',
    icon: HomeIcon,
    current: true,
  },

  {
    name: 'navigation.settings',
    href: '/app/settings',
    icon: Cog6ToothIcon,
    current: false,
  },
  {
    name: 'navigation.cards',
    href: '/app/cards',
    icon: ListBulletIcon,
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });
  return { user };
};

export default function App() {
  const location = useLocation();

  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex">
        {/* <nav className="flex flex-col h-screen bg-white flex-none w-16 border-r border-slate-200 items-center">
          <div className="w-10 h-10 bg-blue-300 rounded-full mt-4 mb-6" />
          <ul className="flex flex-1 flex-col gap-y-2 justify-center">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  className={() =>
                    classNames(
                      location.pathname === item.href
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )
                  }
                  to={item.href}
                >
                  <item.icon
                    className={classNames(
                      location.pathname === item.href
                        ? 'text-indigo-600'
                        : 'text-gray-400 group-hover:text-indigo-600',
                      'h-6 w-6 shrink-0'
                    )}
                    aria-hidden="true"
                  />
                </NavLink>
              </li>
            ))}

            <li className="-mx-6 mt-auto">
              <a
                href="/app/settings"
                className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
              >
                <img
                  className="h-8 w-8 rounded-full bg-gray-50"
                  src={user.picture}
                  alt=""
                />
              </a>
            </li>
          </ul>
        </nav> */}

        <main className="bg-white flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
}
