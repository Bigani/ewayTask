import React from "react";
import { TContactsResponse } from "../eWayAPI/ContactsResponse";

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactForm({
  onSubmit,
}: {
  onSubmit: (email: string) => Promise<TContactsResponse>;
}) {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return showToast("Enter an email address");
    if (!regexEmail.test(email))
      return showToast("Enter a valid email address");
    setLoading(true);
    try {
      const response = await onSubmit(email);
      if (response && response.Data.length === 0) {
        showToast("No contact found for this email");
      }
    } finally {
      setLoading(false);
    }
  }

  const toastDuration = 400;

  function showToast(message: string) {
    setError(message);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setTimeout(() => {
        setError(null);
      }, toastDuration);
    }, 4000);
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="maw-w-md mx-auto bg-white rounded-lg p-6 space-y-4"
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contact@example.com"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="py-3 px-4 w-full  justify-center items-center gap-2 rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-700 focus:outline-none  transition-all duration-300 hover:scale-[1.01] dark:focus:ring-offset-red-800"
        >
          {loading ? "Looking..." : "Lookup"}
        </button>
      </form>
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg bg-red-500 text-white transition-all duration-${toastDuration} 
          ${
            toast
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform  translate-y-4"
          }
        `}
      >
        {error}
      </div>
    </>
  );
}

export default ContactForm;
