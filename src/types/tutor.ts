

type Tutor = {
  _id: string;
  name: string;
  slug?: { current: string };
  gender?: string;
  subject?: string;
  mode?: string;
  experience?: number;
  education?: {
    highestDegree?: string;
    field?: string;
    institute?: string;
    graduationYear?: number;
  };
  address?: {
    addressLine?: string;
    area?: string;
    city?: string;
    postalCode?: string;
  };
  photo?: { asset?: { _ref: string } };
  bio?: string;
  contact?: string;
  verified?: boolean;
};
