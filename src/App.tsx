import React from "react";
import connection from "./eWayAPI/Connector";
import { TContact, TContactsResponse } from "./eWayAPI/ContactsResponse";
///
import ContactForm from "./components/ContactForm";
import BusinessCard from "./components/BusinessCard";
import { usePersistentHistory } from "./storage/LocalStorage";
import ContactList from "./components/ContactList";
import "./index.css";
///

// Email Examples: mroyster@royster.com, ealbares@gmail.com, oliver@hotmail.com, michael.ostrosky@ostrosky.com, kati.rulapaugh@hotmail.com

const App = () => {
  const [contact, setContact] = React.useState<TContact | null>(null);
  const { history, upsert } = usePersistentHistory();

  const handleContactFormSubmit = async (
    email: string
  ): Promise<TContactsResponse> => {
    // console.log("Looking up contact for email:", email);
    return new Promise<TContactsResponse>((resolve) => {
      try {
        connection.callMethod<TContactsResponse>(
          "SearchContacts",
          {
            transmitObject: {
              Email1Address: email,
            },
            includeProfilePictures: true,
          },
          (result: TContactsResponse) => {
            // console.log("TYPE  ", typeof result);
            // console.log(result);
            if (result.Data.length !== 0 && !!result.Data[0].FileAs) {
              const apiContact = result.Data[0];
              console.log("API CONTACT  ", apiContact);

              const mappedContact: TContact = {
                ItemGUID: apiContact.ItemGUID,
                Email: email,
                FileAs: apiContact.FileAs,
                ProfilePicture: apiContact.ProfilePicture,
                TelephoneNumber1: apiContact.TelephoneNumber1,
                Company: apiContact.Company,
                Title: apiContact.Title,
                BusinessAddressCity: apiContact.BusinessAddressCity,
                BusinessAddressPObox: apiContact.BusinessAddressPObox,
                BusinessAddressPostalCode: apiContact.BusinessAddressPostalCode,
                BusinessAddressState: apiContact.BusinessAddressState,
                BusinessAddressStreet: apiContact.BusinessAddressStreet,
                LastFetchedAt: new Date().toISOString(),
              };
              setContact(mappedContact);
              upsert(mappedContact);
            } else {
              setContact(null);
            }
            resolve(result);
          }
        );
      } catch (error) {
        console.error("Error fetching contact:", error);
        setContact(null);
        resolve({
          Data: [],
          Description: "",
          ReturnCode: "",
        } as TContactsResponse);
      }
    });
  };
  // console.log("Contact:", contact);
  return (
    <div className="min-h-screen bg-gray-300">
      <main className="max-w-xl mx-auto px-6 py-10 space-y-8">
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Find a Contact
          </h2>
          <ContactForm onSubmit={handleContactFormSubmit} />
        </section>

        {contact && (
          <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <BusinessCard contact={contact} />
          </section>
        )}

        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Lookup History
          </h3>
          <ContactList
            history={history}
            onSelect={(c) => {
              // refetch for the latest
              void handleContactFormSubmit(c.Email);
            }}
          />
        </section>
      </main>
    </div>
  );
};

export default App;
