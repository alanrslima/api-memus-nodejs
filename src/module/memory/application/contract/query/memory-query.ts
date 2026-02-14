export interface MemoryQuery {
  getGuest(input: MemoryQueryGetGuestInput): Promise<MemoryQueryGetGuestOutput>;
  list(input: MemoryQueryListInput): Promise<MemoryQueryListOutput>;
  resume(input: MemoryQueryResumeInput): Promise<MemoryQueryResumeOutput>;
  detail(
    input: MemoryQueryDetailInput,
  ): Promise<MemoryQueryDetailOutput | undefined>;
  listGallery(
    input: MemoryQueryListGalleryInput,
  ): Promise<MemoryQueryListGalleryOutput>;
}

export type MemoryQueryGetGuestInput = {
  memoryId: string;
  userId: string;
};

export type MemoryQueryGetGuestOutput = {
  status: string;
  createdAt: string;
};

export type MemoryQueryResumeInput = {
  memoryId: string;
};
export type MemoryQueryResumeOutput = {
  id: string;
  name: string;
  privacyMode: string;
  startDate: Date;
  address?: MemoryAddress;
  coverImage?: {
    url: string;
  };
};

export type MemoryQueryListInput = {
  userId: string;
};

type MemoryAddress = {
  id: string;
  country: string;
  countryCode: string;
  state: string;
  city: string;
  neighborhood: string;
  longitude: number;
  latitude: number;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  formatted: string;
};

export type MemoryQueryListOutput = {
  id: string;
  name: string;
  startDate: Date;
  privacyMode: string;
  address?: MemoryAddress;
  photosCount: number;
  status: string;
  videosCount: number;
  coverImage?: {
    url: string;
  };
}[];

export type MemoryQueryDetailInput = {
  memoryId: string;
  userId: string;
};

export type MemoryQueryDetailOutput = {
  id: string;
  name: string;
  privacyMode: string;
  startDate: Date;
  automaticGuestApproval: boolean;
  address?: MemoryAddress;
  photosCount: number;
  videosCount: number;
  createdAt: Date;
  status: string;
  about: string;
  guests: {
    id: string;
    name: string;
    email: string;
    profileUrl: string;
    status: string;
  }[];
  plan?: {
    currencyCode: string;
    description: string;
    id: string;
    name: string;
    price: number;
    photosLimit: number;
    videosLimit: number;
  };
  media: {
    id: string;
    name: string;
    mimetype: string;
    url: string;
  }[];
  coverImage?: {
    name: string;
    url: string;
  };
  messages: {
    user: {
      name: string;
      profileUrl: string;
    };
    message: string;
    createdAt: Date;
  }[];
};

export type MemoryQueryListGalleryInput = {
  page?: number;
  userId: string;
  memoryId: string;
};

export type MemoryQueryListGalleryOutput = {
  data: { id: string; name: string; mimetype: string; url: string }[];
  page: number;
  perPage: number;
  total: number;
};
