export type AIHydrationContext = {
  profile: {
    fullName: string | null;
    activityLevel: string | null;
    weightKg: number | null;
    heightCm: number | null;
  };

  goalMl: number;

  today: {
    totalMl: number;
    percentage: number;
    remainingMl: number;
  };

  recentDays: {
    date: string;
    totalMl: number;
    goalMl: number;
    percentage: number;
    goalCompleted: boolean;
  }[];

  streak: {
    current: number;
    longest: number;
  };
};

export type AIMessageRole =
  | "user"
  | "assistant"
  | "system";

export type AIMessage = {
  id: string;
  conversation_id: string;
  role: AIMessageRole;
  content: string;
  created_at: string;
};

export type AIConversation = {
  id: string;
  user_id: string;
  title: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
};