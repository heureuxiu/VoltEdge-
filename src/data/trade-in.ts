export const tradeInModels = ["iPhone 16 Pro", "iPhone 15 Pro", "iPhone 14", "iPhone 13", "Galaxy S24", "Other"];

export const tradeInStorage = ["128GB", "256GB", "512GB", "1TB"];

export const tradeInQuestions = [
  { id: "cracked", question: "Is the screen cracked?" },
  { id: "damage", question: "Any dents or deep scratches?" },
  { id: "powers", question: "Does it switch on and charge?" },
] as const;

export type TradeInAnswers = Record<(typeof tradeInQuestions)[number]["id"], boolean>;

export function gradeFromAnswers(answers: TradeInAnswers) {
  if (!answers.powers) return "Grade C";
  if (answers.cracked || answers.damage) return "Grade B";
  return "Grade A";
}

export const tradeInSteps = [
  { title: "Get an estimate", description: "Tell us the model and condition — it takes about a minute." },
  { title: "Quick in-store check", description: "We test the device and confirm the final value on the spot." },
  { title: "Use your credit", description: "Take it off any phone, laptop or gadget in store — or get paid out." },
];

export const tradeInGrades = [
  { grade: "Grade A", title: "Like new", description: "No visible marks, screen perfect, battery healthy and everything works.", badgeClassName: "bg-lime text-ink" },
  { grade: "Grade B", title: "Good", description: "Light scratches or scuffs, fully working, no cracks on the screen or back.", badgeClassName: "bg-brand-soft text-blue-900" },
  { grade: "Grade C", title: "Needs work", description: "Cracked glass, heavy wear or a fault — we still make an offer.", badgeClassName: "bg-repair-soft text-orange-800" },
];

export const tradeInChecklist = [
  "Your device, charged",
  "Your ID document",
  "Find My / Google account signed out",
  "A backup of your data",
];
