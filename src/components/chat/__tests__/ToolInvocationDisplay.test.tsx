import { render, screen } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

describe("ToolInvocationDisplay", () => {
  it("displays creating file message for str_replace_editor", () => {
    render(
      <ToolInvocationDisplay
        toolName="str_replace_editor"
        args={{ command: "create", path: "src/App.tsx" }}
        state="pending"
      />
    );
    expect(screen.getByText("Creating file App.tsx")).toBeInTheDocument();
  });

  it("displays editing file message for str_replace_editor", () => {
    render(
      <ToolInvocationDisplay
        toolName="str_replace_editor"
        args={{ command: "str_replace", path: "src/components/Button.jsx" }}
        state="result"
      />
    );
    expect(screen.getByText("Editing file Button.jsx")).toBeInTheDocument();
  });

  it("displays inserting file message for str_replace_editor", () => {
    render(
      <ToolInvocationDisplay
        toolName="str_replace_editor"
        args={{ command: "insert", path: "src/utils/helpers.js" }}
        state="pending"
      />
    );
    expect(screen.getByText("Inserting into file helpers.js")).toBeInTheDocument();
  });

  it("displays viewing file message for str_replace_editor", () => {
    render(
      <ToolInvocationDisplay
        toolName="str_replace_editor"
        args={{ command: "view", path: "README.md" }}
        state="result"
      />
    );
    expect(screen.getByText("Viewing file README.md")).toBeInTheDocument();
  });

  it("displays undoing edit message for str_replace_editor", () => {
    render(
      <ToolInvocationDisplay
        toolName="str_replace_editor"
        args={{ command: "undo_edit", path: "config.json" }}
        state="pending"
      />
    );
    expect(screen.getByText("Undoing edit in file config.json")).toBeInTheDocument();
  });

  it("displays renaming file message for file_manager", () => {
    render(
      <ToolInvocationDisplay
        toolName="file_manager"
        args={{ command: "rename", path: "old.js", new_path: "new.js" }}
        state="pending"
      />
    );
    expect(screen.getByText("Renaming file old.js to new.js")).toBeInTheDocument();
  });

  it("displays deleting file message for file_manager", () => {
    render(
      <ToolInvocationDisplay
        toolName="file_manager"
        args={{ command: "delete", path: "temp.txt" }}
        state="result"
      />
    );
    expect(screen.getByText("Deleting file temp.txt")).toBeInTheDocument();
  });

  it("displays fallback message for unknown tool", () => {
    render(
      <ToolInvocationDisplay
        toolName="unknown_tool"
        args={{}}
        state="pending"
      />
    );
    expect(screen.getByText("Running unknown_tool")).toBeInTheDocument();
  });

  it("displays fallback message for str_replace_editor with unknown command", () => {
    render(
      <ToolInvocationDisplay
        toolName="str_replace_editor"
        args={{ command: "unknown", path: "test.js" }}
        state="pending"
      />
    );
    expect(screen.getByText("Running str_replace_editor")).toBeInTheDocument();
  });

  it("extracts basename correctly", () => {
    render(
      <ToolInvocationDisplay
        toolName="str_replace_editor"
        args={{ command: "create", path: "deep/nested/file.js" }}
        state="pending"
      />
    );
    expect(screen.getByText("Creating file file.js")).toBeInTheDocument();
  });

  it("handles rename without new_path", () => {
    render(
      <ToolInvocationDisplay
        toolName="file_manager"
        args={{ command: "rename", path: "file.js" }}
        state="pending"
      />
    );
    expect(screen.getByText("Renaming file file.js")).toBeInTheDocument();
  });

  it("shows loader for pending state", () => {
    render(
      <ToolInvocationDisplay
        toolName="str_replace_editor"
        args={{ command: "create", path: "test.js" }}
        state="pending"
      />
    );
    const svg = document.querySelector("svg");
    expect(svg).toHaveClass("animate-spin");
  });

  it("shows green dot for result state", () => {
    render(
      <ToolInvocationDisplay
        toolName="str_replace_editor"
        args={{ command: "create", path: "test.js" }}
        state="result"
      />
    );
    const dot = screen.getByText("Creating file test.js").previousElementSibling;
    expect(dot).toHaveClass("bg-emerald-500");
  });
});