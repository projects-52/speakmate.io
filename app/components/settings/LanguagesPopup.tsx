import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

interface LanguagePopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const languages: Record<string, { nativeName: string; icon: string }> = {
  en: { nativeName: 'English', icon: '🇺🇸' },
  ua: { nativeName: 'Українська', icon: '🇺🇦' },
};

export default function LanguagePopup({ open, setOpen }: LanguagePopupProps) {
  const { i18n } = useTranslation();
  const [redirectTo, setRedirectTo] = useState<string>('/');

  useEffect(() => {
    if (window) {
      setRedirectTo(window.location.pathname);
    }
  }, []);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-primary px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Select language
                  </h3>
                  <div className="mt-4 flex flex-col gap-4">
                    {Object.keys(languages).map((lng) => (
                      <Form
                        method="post"
                        action="/api/settings/language"
                        key={lng}
                      >
                        <input name="locale" type="hidden" value={lng} />
                        <input
                          name="redirectTo"
                          type="hidden"
                          value={redirectTo}
                        />
                        {i18n.resolvedLanguage === lng ? (
                          <button
                            type="submit"
                            className="rounded-md bg-primary-dark p-4 text-sm font-semibold text-slate-600 shadow-sm w-full text-left flex gap-4 items-center"
                          >
                            <span className="text-2xl">
                              {languages[lng].icon}
                            </span>
                            <span>{languages[lng].nativeName}</span>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="rounded-md  p-4 text-sm font-semibold text-gray-900 w-full text-left flex gap-4 items-center"
                          >
                            <span className="text-2xl">
                              {languages[lng].icon}
                            </span>
                            <span>{languages[lng].nativeName}</span>
                          </button>
                        )}
                      </Form>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
