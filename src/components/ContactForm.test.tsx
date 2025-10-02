// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ContactForm from "./ContactForm";

afterEach(() => {
  cleanup();
});

describe("ContactForm", () => {
  it("renders input and button", () => {
    render(<ContactForm onSubmit={jest.fn()} />);
    expect(
      screen.getByPlaceholderText(/contact@example.com/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /lookup/i })).toBeInTheDocument();
  });

  it("shows error for empty email", async () => {
    render(<ContactForm onSubmit={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /lookup/i }));
    await waitFor(() =>
      expect(screen.getByText(/enter an email address/i)).toBeInTheDocument()
    );
  });

  it("shows error for invalid email", async () => {
    render(<ContactForm onSubmit={jest.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/contact@example.com/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /lookup/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/enter a valid email address/i)
      ).toBeInTheDocument()
    );
  });

  it("calls onSubmit with valid email", async () => {
    const onSubmit = jest.fn().mockResolvedValue({ Data: [] });
    render(<ContactForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/contact@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /lookup/i }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith("test@example.com")
    );
  });

  it("shows toast if no contact found", async () => {
    const onSubmit = jest.fn().mockResolvedValue({ Data: [] });
    render(<ContactForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/contact@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /lookup/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/no contact found for this email/i)
      ).toBeInTheDocument()
    );
  });

  it("clears error toast after timeout", async () => {
    jest.useFakeTimers();
    render(<ContactForm onSubmit={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /lookup/i }));
    expect(
      await screen.findByText(/enter an email address/i)
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(4400);
    });
    await waitFor(() =>
      expect(screen.queryByText(/enter an email address/i)).toBeNull()
    );
    jest.useRealTimers();
  });
});
