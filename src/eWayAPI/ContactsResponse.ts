import { IApiResult } from "@eway-crm/connector";

export type TContactsResponse = IApiResult & {
  Data: TContact[];
};

export type TContact = ContactInfo & {
  FileAs: string | null;
};

export type ContactInfo = {
  ItemGUID: string;
  Email1Address: string | null;
  ProfilePicture: string | null;
  TelephoneNumber1: string | null;
  Company: string | null;
  Title: string | null;
  BusinessAddressCity: string | null;
  BusinessAddressPObox: string | null;
  BusinessAddressPostalCode: string | null;
  BusinessAddressState: string | null;
  BusinessAddressStreet: string | null;
  LastFetchedAt: string; // ISO timestamp
};
