export interface CheckInResponse {
  id: string;
  created: number;
  modified: number;
  duration: number;
  tag: string;
  activities: string;
  author: string;
}

export interface CheckInForm {
  duration: number;
  tag: string;
  activities: string;
}
