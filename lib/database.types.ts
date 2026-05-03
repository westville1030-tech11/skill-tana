export type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  days: number;
  service_type?: "spot" | "ongoing";
  experience_type?: "failure" | "inheritance";
  frequency?: string;
  experience_story?: string; // 「どんな問題に直面し、どう解決したか」の実体験
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
  experience_years: string | null;
  annual_income_bracket: string | null;
  availability: "available" | "busy" | "part-time" | null;
  services: Service[] | null;
  company: string | null;
  company_display?: string | null;
  role: string | null;
  linkedin_connections: "under_100" | "100_500" | "500_1000" | "over_1000" | null;
  past_companies: string[] | null;
  past_companies_display: string[] | null;
  linkedin_verified: boolean | null;
  corporate_email_verified: boolean | null;
  corporate_email_domain: string | null;
  card_verified: boolean | null;
  card_company: string | null;
  card_role: string | null;
  password_hash: string | null;
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
