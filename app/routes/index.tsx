import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Link
        to="/auth"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </Link>
    </div>
  );
}
