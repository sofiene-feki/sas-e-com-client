import React from "react";

export default function FormatDescription(text) {
  if (!text || typeof text !== "string") return "";
  return (
    text
      // 1️⃣ Add newline before ✓ (except if it's the first char)
      .replace(/(?!^)\s*✓/g, "\n✓")
      // 2️⃣ Bold text between *...*
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
  );
}
