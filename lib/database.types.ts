export type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  days: number;
};

export type Profile = {
  id: string;
  linkedin_id: string;
  name: string;
  email: string | null;
  image: string | null;
  headline: string | null;
  bio: string | null;
  skills: string[] | null;
  ai_tools: string[] | null;
  category: "consultant" | "engineer" | "designer" | "other" | null;
  linkedin_url: string | null;
  hourly_rate: string | null;
  availability: "available" | "busy" | "part-time" | null;
  services: Service[] | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { linkedin_id: string; name: string };
        Update: Partial<Profile>;
      };
    };
  };
};
