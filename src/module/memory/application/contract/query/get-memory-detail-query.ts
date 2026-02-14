export interface GetMemoryDetailQuery {
  execute(
    input: GetMemoryDetailQueryInput,
  ): Promise<GetMemoryDetailQueryOutput>;
}

export interface GetMemoryDetailQueryInput {
  memoryId: string;
}

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

export interface GetMemoryDetailQueryOutput {
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
}
