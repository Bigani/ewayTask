// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { TContact } from "../eWayAPI/ContactsResponse";
import ContactList from "./ContactList";

afterEach(() => {
  cleanup();
});

const mockContacts: TContact[] = [
  {
    ItemGUID: "1",
    Email: "test1@example.com",
    FileAs: "Test User 1",
    ProfilePicture: null,
    TelephoneNumber1: null,
    Company: "TestCo",
    Title: "Manager",
    BusinessAddressCity: "City",
    BusinessAddressPObox: null,
    BusinessAddressPostalCode: null,
    BusinessAddressState: null,
    BusinessAddressStreet: null,
    LastFetchedAt: "2023-01-01T00:00:00Z",
  },
  {
    ItemGUID: "2",
    Email: "test2@example.com",
    FileAs: "Test User 2",
    ProfilePicture: null,
    TelephoneNumber1: "987654321",
    Company: "TestCo2",
    Title: "Developer",
    BusinessAddressCity: "City2",
    BusinessAddressPObox: null,
    BusinessAddressPostalCode: null,
    BusinessAddressState: null,
    BusinessAddressStreet: null,
    LastFetchedAt: "2023-01-02T00:00:00Z",
  },
];

describe("ContactList", () => {
  it("renders no contacts message when history is empty", () => {
    render(<ContactList contactHistory={[]} />);
    expect(screen.getByText(/no contacts visited yet/i)).toBeInTheDocument();
  });

  it("renders contacts when history is provided", () => {
    render(<ContactList contactHistory={mockContacts} />);
    expect(screen.getByText("Test User 1")).toBeInTheDocument();
    expect(screen.getByText("Test User 2")).toBeInTheDocument();
  });

  it("calls onSelect when a contact is clicked", () => {
    const handleSelect = jest.fn();
    render(
      <ContactList contactHistory={mockContacts} onSelect={handleSelect} />
    );
    fireEvent.click(screen.getByText("Test User 1"));
    expect(handleSelect).toHaveBeenCalledWith(mockContacts[0]);
  });

  it("shows name (File As)", () => {
    render(<ContactList contactHistory={mockContacts} />);
    expect(screen.getByText(/Test User 1/)).toBeInTheDocument();
    expect(screen.getByText(/Test User 2/)).toBeInTheDocument();
  });
});
