import { TContact } from "../eWayAPI/ContactsResponse";

type Props = {
  contactHistory: TContact[];
  onSelect?: (contact: TContact) => void;
};

function ContactList({ contactHistory, onSelect }: Props) {
  if (contactHistory.length === 0)
    return <div className="text-gray-500 italic">No contacts visited yet.</div>;
  else
    return (
      <ul className="divide-y p-2 space-y-2 divide-gray-200 bg-white rounded-lg overflow-hidden max-w-md mx-auto ">
        {contactHistory.map((contact) => (
          <li
            key={contact.ItemGUID}
            className="flex items-center rounded-lg  p-4 hover:bg-gray-300 shadow-md shadow-red-300/50 cursor-pointer transition bg-gray-200 hover:bg-gray-300"
            onClick={onSelect ? () => onSelect(contact) : undefined}
          >
            <div className="flex items-center gap-2">
              {contact.ProfilePicture && (
                <img
                  src={`data:image/png;base64,${contact.ProfilePicture}`}
                  alt=""
                  width={100}
                  height={100}
                  className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                />
              )}
              <span>{contact.FileAs || contact.Email}</span>
            </div>
          </li>
        ))}
      </ul>
    );
}

export default ContactList;
