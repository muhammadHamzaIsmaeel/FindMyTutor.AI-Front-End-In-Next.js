export type FormData = {
  name: string;
  subject: string;
  slug?: { current: string };
  gender: "male" | "female";
  mode: "online" | "home" | "institute";
  experience: number; // ✅ number rakha (form ke hisaab se)
  contact: string;
  bio?: string;

  education: {
    highestDegree: string;
    field: string;
    institute: string;
    graduationYear?: number;
  };

  address: {
    city: string;
    area: string;
    addressLine: string;
    postalCode?: string;
  };
};
