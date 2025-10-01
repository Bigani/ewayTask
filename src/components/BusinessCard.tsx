import type { TContact } from "../eWayAPI/ContactsResponse";

function BusinessCard({ contact }: { contact: TContact | null }) {
  if (!contact) return null;

  return (
    <div className="py-3 px-4 w-full justify-center items-center gap-2 rounded-lg border border-transparent bg-gray-200 text-white hover:bg-gray-300 focus:outline-none transition-all duration-300 hover:scale-[1.01] dark:focus:ring-offset-gray-800 shadow-lg shadow-red-300/50">
      <div className="flex items-center p-6 space-x-4">
        {contact.ProfilePicture ? (
          <img
            src={
              contact.ProfilePicture.startsWith("data:")
                ? contact.ProfilePicture
                : `data:image/png;base64,${contact.ProfilePicture}`
            }
            alt={contact.FileAs ?? contact.Email}
            className="w-20 h-20 rounded-full object-cover  "
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            {/* No pfp */}
            {contact.FileAs?.split(" ")
              .map((w) => w[0])
              .join("") ?? "?"}
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-gray-800">{contact.FileAs}</h2>
          <p className="text-sm text-gray-600">
            {contact.Title} {contact.Company && `at ${contact.Company}`}
          </p>
        </div>
      </div>
      <div className="px-6 pb-6">
        {contact.BusinessAddressStreet && (
          <p className="text-gray-700">
            <strong>Address:</strong> {contact.BusinessAddressStreet},{" "}
            {contact.BusinessAddressCity}
          </p>
        )}
        {
          <p className="text-gray-700">
            <strong>Email:</strong> {contact.Email}
          </p>
        }
        {contact.TelephoneNumber1 && (
          <p className="text-gray-700">
            <strong>Phone:</strong> {contact.TelephoneNumber1}
          </p>
        )}
        <p className="text-gray-500 text-xs mt-4">
          Last fetched: {new Date(contact.LastFetchedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default BusinessCard;
