export type Priority = "High" | "Medium" | "Low";

export interface PriorityStyle {
	chip: string;
	label: string;
	accent: string;
}

export const PRIORITY_STYLES: Record<Priority, PriorityStyle> = {
	High: {
		chip: "bg-red-300",
		label: "text-red-800",
		accent: "border-l-red-500",
	},
	Medium: {
		chip: "bg-yellow-300",
		label: "text-yellow-800",
		accent: "border-l-yellow-500",
	},
	Low: {
		chip: "bg-green-300",
		label: "text-green-800",
		accent: "border-l-green-500",
	},
};

export const getPriorityStyle = (priority: Priority): PriorityStyle => {
	return PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Medium;
};

export const getPriorityLabel = (priority: Priority): string => {
	return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : "";
};
