import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
test("check render App.tsx", () => {
    const queryClient = new QueryClient();
    render(_jsx(QueryClientProvider, { client: queryClient, children: _jsx(App, {}) }));
    expect(screen.getByText("Loading...")).toBeDefined();
});
