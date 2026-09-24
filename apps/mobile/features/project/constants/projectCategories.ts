import type { Ionicons } from "@expo/vector-icons";
import type { ProjectCategory } from "@/features/project/types/project.types";

export interface CategoryConfig {
  key: ProjectCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
}

export const PROJECT_CATEGORIES: CategoryConfig[] = [
  {
    key: "coding",
    label: "Koding",
    icon: "code-slash-outline",
    color: "#6366f1",
    bgColor: "#eef2ff",
  },
  {
    key: "learning",
    label: "Belajar",
    icon: "school-outline",
    color: "#0891b2",
    bgColor: "#ecfeff",
  },
  {
    key: "work",
    label: "Pekerjaan",
    icon: "briefcase-outline",
    color: "#ca8a04",
    bgColor: "#fefce8",
  },
  {
    key: "fitness",
    label: "Olahraga",
    icon: "fitness-outline",
    color: "#16a34a",
    bgColor: "#f0fdf4",
  },
  {
    key: "personal",
    label: "Personal",
    icon: "sparkles-outline",
    color: "#e11d48",
    bgColor: "#fff1f2",
  },
];

export const getCategoryConfig = (key?: string): CategoryConfig =>
  PROJECT_CATEGORIES.find((c) => c.key === key) ?? PROJECT_CATEGORIES[0];
