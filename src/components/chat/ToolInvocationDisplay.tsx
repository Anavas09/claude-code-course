import React from "react";
import { Loader2 } from "lucide-react";

interface ToolInvocationDisplayProps {
  toolName: string;
  args?: any;
  state: string;
}

export function ToolInvocationDisplay({
  toolName,
  args,
  state,
}: ToolInvocationDisplayProps) {
  const getBasename = (path: string) => path.split('/').pop() || path;

  const generateMessage = () => {
    if (toolName === "str_replace_editor" && args) {
      const { command, path } = args;
      const filename = getBasename(path);
      switch (command) {
        case "create":
          return `Creating file ${filename}`;
        case "str_replace":
          return `Editing file ${filename}`;
        case "insert":
          return `Inserting into file ${filename}`;
        case "view":
          return `Viewing file ${filename}`;
        case "undo_edit":
          return `Undoing edit in file ${filename}`;
        default:
          return `Running ${toolName}`;
      }
    } else if (toolName === "file_manager" && args) {
      const { command, path, new_path } = args;
      const filename = getBasename(path);
      switch (command) {
        case "rename":
          if (new_path) {
            const newFilename = getBasename(new_path);
            return `Renaming file ${filename} to ${newFilename}`;
          }
          return `Renaming file ${filename}`;
        case "delete":
          return `Deleting file ${filename}`;
        default:
          return `Running ${toolName}`;
      }
    } else {
      return `Running ${toolName}`;
    }
  };

  const message = generateMessage();

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {state === "result" ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}