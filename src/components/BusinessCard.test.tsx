// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup } from "@testing-library/react";
import { TContact } from "../eWayAPI/ContactsResponse";
import BusinessCard from "./BusinessCard";
import { loadHistory, saveHistory } from "../storage/LocalStorage";

afterEach(() => {
  cleanup();
});

const mockContacts: TContact = {
  ItemGUID: "1",
  Email1Address: "test@test.com",
  FileAs: "Test User",
  ProfilePicture: null,
  TelephoneNumber1: "123456789",
  Company: "TestCo",
  Title: "Manager",
  BusinessAddressCity: "City",
  BusinessAddressPObox: null,
  BusinessAddressPostalCode: null,
  BusinessAddressState: null,
  BusinessAddressStreet: null,
  LastFetchedAt: "2023-01-01T00:00:00Z",
};

describe("BusinessCard", () => {
  it("renders nothing if contact is null", () => {
    const { container } = render(<BusinessCard contact={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders contact details", () => {
    render(<BusinessCard contact={mockContacts} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
    expect(screen.getByText(/TestCo/i)).toBeInTheDocument();
    expect(screen.getByText(/Manager/i)).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
  });

  it("falls back to placeholder if no profile picture", () => {
    render(<BusinessCard contact={mockContacts} />);
    const placeholder = screen.getByText("TU");
    expect(placeholder).toBeInTheDocument();
  });
});

describe("LocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and loads history", () => {
    saveHistory([mockContacts]);
    const loaded = loadHistory();
    expect(loaded).toEqual([mockContacts]);
  });

  it("returns empty array if nothing in storage", () => {
    const loaded = loadHistory();
    expect(loaded).toEqual([]);
  });

  it("overwrites history when saving new data", () => {
    const contact2 = {
      ...mockContacts,
      ItemGUID: "2",
      Email: "second@test.com",
    };
    saveHistory([mockContacts]);
    saveHistory([contact2]);
    const loaded = loadHistory();
    expect(loaded).toEqual([contact2]);
  });

  it("handles corrupted JSON", () => {
    localStorage.setItem("contactsHistoryV1", "{invalidJson");
    const loaded = loadHistory();
    expect(loaded).toEqual([]);
  });
});
