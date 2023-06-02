import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Logo } from '~/components/ui/Logo';

export default function Auth() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>

        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-gray-900">
          {t('auth.title')}
        </h2>
      </div>

      <Form
        method="post"
        action="/api/auth/google"
        className="mt-4 sm:mx-auto sm:w-full sm:max-w-md flex justify-center"
      >
        <button
          type="submit"
          className="mt-8 w-64 inline-flex items-center gap-x-2 rounded-md bg-red-500 px-3.5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
        >
          <svg
            className="w-10 h-10 pr-2 box-border border-r border-red-600"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="#fff"
          >
            <path d="M10.84 4.82a3.837 3.837 0 00-2.7-1.05c-1.837 0-3.397 1.233-3.953 2.891a4.17 4.17 0 000 2.68h.003c.558 1.657 2.115 2.889 3.952 2.889.948 0 1.761-.241 2.392-.667v-.002a3.239 3.239 0 001.407-2.127H8.14V6.74h6.64c.082.468.121.946.121 1.422 0 2.129-.765 3.929-2.096 5.148l.001.001C11.64 14.38 10.038 15 8.14 15a7.044 7.044 0 01-6.29-3.855 6.97 6.97 0 010-6.287A7.042 7.042 0 018.139 1a6.786 6.786 0 014.71 1.821L10.84 4.82z" />
          </svg>
          {t('auth.google')}
        </button>
      </Form>
    </div>
  );
}
