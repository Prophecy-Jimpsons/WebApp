import { useState } from "react";

interface CopyToClipboardResult {
  copiedMap: { [key: string]: boolean };
  copyToClipboard: (text: string, key: string) => Promise<void>;
}

export function useCopyToClipboard(): CopyToClipboardResult {
  const [copiedMap, setCopiedMap] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMap((prev) => ({ ...prev, [key]: true }));

      setTimeout(() => {
        setCopiedMap((prev) => ({ ...prev, [key]: false }));
      }, 2500); // reset copied state after 2.5 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return { copiedMap, copyToClipboard };
}
