import { availableTools, plannedTools, popularTools } from "@/lib/tool-registry/tools";

export const popularSearches = popularTools.slice(0, 7).map((tool) => tool.name);

export const faqs = [
  {
    question: "Which tools can I use right now?",
    answer: `${availableTools.length} tools are available now: ${availableTools.map((tool) => tool.name).join(", ")}. The remaining ${plannedTools.length} catalog entries are labeled Coming Soon.`,
  },
  {
    question: "How is my input handled?",
    answer:
      "The available tools process input in your browser. Word Counter text, Percentage Calculator values, Unit Converter settings, and Color Picker values are saved in this browser's local storage so they remain between visits. Use each tool's reset control or clear your site data in browser settings to remove them.",
  },
  {
    question: "Are the available tools free?",
    answer:
      "Yes. The currently available browser-based tools are free and do not require an account.",
  },
  {
    question: "Can I use ToolNext on mobile?",
    answer:
      "The app is responsive and its available tools work on mobile and tablet screens.",
  },
];
