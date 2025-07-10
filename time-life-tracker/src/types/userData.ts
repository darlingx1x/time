export interface TimeSession {
  id: string;
  category: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
  tags: string[];
}

export interface Emotion {
  date: string;
  mood: string;
  note: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration_minutes: number;
}

export interface UserData {
  user: {
    telegram_id: number | string;
    username: string;
    first_login: string;
  };
  time_sessions: TimeSession[];
  todos: Todo[];
  emotions: Emotion[];
  calendar_events: CalendarEvent[];
}
