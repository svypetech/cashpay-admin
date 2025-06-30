// Base response interface
interface BaseKycResponse {
  success: boolean;
  message: string;
}

// Interface for "new" status user
export interface NewKycUser {
  status: "new";
}

// Interface for complete KYC user data
export interface CompleteKycUser {
  id: string;
  personalIdentificationNumber: string;
  coreUserId: string;
  providerId: string;
  title: string;
  firstName: string;
  lastName: string;
  nationality: string;
  occupation: string;
  dateOfBirth: string;
  placeOfBirth: string;
  country: string;
  address: string;
  district: string;
  city: string;
  postalCode: string;
  isSameResidentialAddress: boolean;
  residentialCountry: string;
  residentialAddress: string;
  residentialDistrict: string;
  residentialCity: string;
  residentialPostalCode: string;
  phoneNumber: string;
  email: string;
  passportImage: string;
  passportSelfie: string;
  digitalSignature: string;
  status: "approved" | "requested" | "new";
  rejectionReason: string | null;
  updateReason: string | null;
  bankAccountType: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Union type for KYC user data
export type KycUserData = NewKycUser | CompleteKycUser;

// Response interface for "new" status
interface NewKycResponse extends BaseKycResponse {
  kycUser: {
    kycUser: NewKycUser;
  };
}

// Response interface for complete KYC data
interface CompleteKycResponse extends BaseKycResponse {
  kycUser: CompleteKycUser;
}

// Main union type for the response
export type KycUserResponse = NewKycResponse | CompleteKycResponse;

// Type guard to check if the response contains complete KYC data
export function isCompleteKycUser(user: KycUserData): user is CompleteKycUser {
  return 'id' in user;
}

// Type guard to check if the response is for a new user
export function isNewKycUser(user: KycUserData): user is NewKycUser {
  return user.status === 'new' && !('id' in user);
}