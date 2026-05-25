import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/contact-form";

// Mock the server action since it uses "use server" directive
vi.mock("@/lib/actions/contact", () => ({
  submitContact: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ContactForm", () => {
  it("renders all form fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Company")).toBeInTheDocument();
    expect(
      screen.getByLabelText(/what are you working on/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
  });

  it("shows success state after successful submission", async () => {
    const { submitContact } = await import("@/lib/actions/contact");
    vi.mocked(submitContact).mockResolvedValue({ success: true });

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Test User");
    await user.type(screen.getByLabelText(/work email/i), "test@example.com");
    await user.type(
      screen.getByLabelText(/what are you working on/i),
      "Test message that is long enough to be valid",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
  });

  it("shows error state after failed submission", async () => {
    const { submitContact } = await import("@/lib/actions/contact");
    vi.mocked(submitContact).mockResolvedValue({
      error: "Something went wrong",
    });

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Test User");
    await user.type(screen.getByLabelText(/work email/i), "test@example.com");
    await user.type(
      screen.getByLabelText(/what are you working on/i),
      "Test message",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText(/something went wrong/i),
    ).toBeInTheDocument();
  });

  it("disables submit button while pending", async () => {
    const { submitContact } = await import("@/lib/actions/contact");
    // Never resolves so we can test the pending state
    vi.mocked(submitContact).mockImplementation(
      () => new Promise(() => {}),
    );

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Test User");
    await user.type(screen.getByLabelText(/work email/i), "test@example.com");
    await user.type(
      screen.getByLabelText(/what are you working on/i),
      "Test message that is long enough to be valid",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      screen.getByRole("button", { name: /sending/i }),
    ).toBeDisabled();
  });
});
