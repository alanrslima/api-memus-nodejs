export interface GalleryDTO {
  data: {
    id: string;
    name: string;
    mimetype: string;
    url: string;
    createdAt: string;
    user: {
      name: string;
      profileUrl?: string;
    } | null;
  }[];
  page: number;
  perPage: number;
  total: number;
}
