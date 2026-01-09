
export interface GSTInfo {
  gstNumber: string;
  legalName: string;
  tradeName?: string;
  constitutionOfBusiness: string;
  registrationDate: string;
  taxpayerType: string;
  gstStatus: 'Active' | 'Inactive' | 'Cancelled';
  centerJurisdiction: string;
  stateJurisdiction: string;
  address: string;
}

export interface IFSCInfo {
  ifsc: string;
  bankName: string;
  branch: string;
  address: string;
  city: string;
  state: string;
  contact?: string;
  micr?: string;
}

export interface InstagramInfo {
  username: string;
  fullName: string;
  bio: string;
  followers: string;
  following: string;
  posts: string;
  isPrivate: boolean;
  isVerified: boolean;
  profilePicUrl?: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  creatorTip: string;
  url: string;
  viralScore: number;
  hook: string;
}

export interface NewsInfo {
  topic: string;
  newsItems: NewsItem[];
}

export interface VisualInfo {
  mode: 'ocr' | 'bg-remove';
  originalImage: string;
  extractedText?: string;
  processedImage?: string;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export type ActiveTool = 'gst' | 'ifsc' | 'instagram' | 'news' | 'visual';
