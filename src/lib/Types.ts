export interface CounterType {
  id: string;
  sid: string;
  user_id: string;
  title: string;
  description: string;
  created_at: Date;
  modified_at: Date;
  end_date: Date;
  is_public: boolean;
}

export interface ToastState {
  isVisible: boolean;
  message: string;
  type?: "success" | "error" | "info";
}
