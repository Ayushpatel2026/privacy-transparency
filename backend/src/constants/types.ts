export type User = {
	userId: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

// ===================================================================
// ===================================================================

export type JournalData = {
	date: string; // ISO date string
	userId: string;
	journalId: string;
	bedtime: string;
	alarmTime: string;
	sleepDuration: string;
	diaryEntry: string;
	sleepNotes: SleepNote[];
}

export type SleepNote = "Pain" | "Stress" | "Anxiety" | "Medication" | "Caffeine" | "Alcohol" | "Warm Bath" | "Heavy Meal";

// ===================================================================
// ===================================================================

export type GeneralHealthData = {
	userId: string;
	currentSleepDuration: string; 
	snoring: string;  
	tirednessFrequency: string;
	daytimeSleepiness: string;
}