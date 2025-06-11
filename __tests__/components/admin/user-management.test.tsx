import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserManagement } from "@/components/admin/user-management";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { server } from "@/tests/mocks/server";
import { rest } from "msw";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe("UserManagement", () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    queryClient.clear();
  });
  afterAll(() => server.close());

  it("renders user list correctly", async () => {
    render(<UserManagement />, { wrapper });

    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    // Check table headers
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
  });

  it("handles search functionality", async () => {
    render(<UserManagement />, { wrapper });

    const searchInput = screen.getByPlaceholder("Search users...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    // Wait for debounced search
    await waitFor(() => {
      expect(queryClient.getQueryData(["users", 1, "test", null])).toBeDefined();
    });
  });

  it("handles role filtering", async () => {
    render(<UserManagement />, { wrapper });

    const roleSelect = screen.getByRole("combobox", { name: /filter by role/i });
    fireEvent.click(roleSelect);
    fireEvent.click(screen.getByText("Admin"));

    await waitFor(() => {
      expect(queryClient.getQueryData(["users", 1, "", "admin"])).toBeDefined();
    });
  });

  it("handles user role update", async () => {
    server.use(
      rest.patch("/api/admin/users", (req, res, ctx) => {
        return res(
          ctx.json({
            user: {
              id: "1",
              email: "test@example.com",
              role: "admin",
            },
          })
        );
      })
    );

    render(<UserManagement />, { wrapper });

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    // Open edit dialog
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    // Change role
    const roleSelect = screen.getByRole("combobox", { name: /select role/i });
    fireEvent.click(roleSelect);
    fireEvent.click(screen.getByText("Admin"));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/user updated successfully/i)).toBeInTheDocument();
    });
  });

  it("handles error states", async () => {
    server.use(
      rest.get("/api/admin/users", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<UserManagement />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch users/i)).toBeInTheDocument();
    });
  });
});