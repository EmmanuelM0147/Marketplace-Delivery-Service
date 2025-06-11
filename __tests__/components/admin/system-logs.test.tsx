import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SystemLogs } from "@/components/admin/system-logs";
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

describe("SystemLogs", () => {
  beforeAll(() => server.listen());
  
  beforeEach(() => {
    // Reset timers before each test
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    server.resetHandlers();
    queryClient.clear();
    // Clean up timers after each test
    jest.useRealTimers();
  });
  
  afterAll(() => server.close());

  it("renders logs table correctly", async () => {
    render(<SystemLogs />, { wrapper });

    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Timestamp")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });
  });

  it("handles date range filtering", async () => {
    render(<SystemLogs />, { wrapper });

    const dateRangePicker = screen.getByRole("button", { name: /pick a date/i });
    fireEvent.click(dateRangePicker);

    // Select date range
    const startDate = screen.getByRole("button", { name: /march 1/i });
    fireEvent.click(startDate);
    const endDate = screen.getByRole("button", { name: /march 15/i });
    fireEvent.click(endDate);

    await waitFor(() => {
      expect(queryClient.getQueryData(["logs", 1, { from: expect.any(Date), to: expect.any(Date) }, null, null])).toBeDefined();
    });
  });

  it("handles severity filtering", async () => {
    render(<SystemLogs />, { wrapper });

    const severitySelect = screen.getByRole("combobox", { name: /filter by severity/i });
    fireEvent.click(severitySelect);
    fireEvent.click(screen.getByText("Error"));

    await waitFor(() => {
      expect(queryClient.getQueryData(["logs", 1, undefined, "error", null])).toBeDefined();
    });
  });

  it("handles log export", async () => {
    const mockBlob = new Blob(["test"], { type: "text/csv" });
    const mockURL = "blob:test";
    
    global.URL.createObjectURL = jest.fn(() => mockURL);
    global.URL.revokeObjectURL = jest.fn();

    server.use(
      rest.post("/api/admin/logs", (req, res, ctx) => {
        return res(
          ctx.set("Content-Type", "text/csv"),
          ctx.set("Content-Disposition", 'attachment; filename="system-logs.csv"'),
          ctx.body(mockBlob)
        );
      })
    );

    render(<SystemLogs />, { wrapper });

    const exportButton = screen.getByRole("button", { name: /export csv/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.getByText(/logs exported successfully/i)).toBeInTheDocument();
    });

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(mockURL);
  });

  it("handles refresh interval changes", async () => {
    render(<SystemLogs />, { wrapper });

    const intervalSelect = screen.getByRole("combobox", { name: /refresh interval/i });
    fireEvent.click(intervalSelect);
    fireEvent.click(screen.getByText("5 seconds"));

    // Run all pending timers
    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(queryClient.getQueryState(["logs"]))?.toHaveProperty("dataUpdateCount", 1);
    });
  });
});