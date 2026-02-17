import { ID } from "../../../../../common";
import { Image } from "../../../../domain/entity/image";
import { Memory } from "../../../../domain/entity/memory";

export type MemoryRow = {
  id: string;
  name?: string | null;
  start_date?: Date | null;
  cover_image?: string | null;
  selected_plan_id?: string | null;
  order_id?: string | null;
  user_id: string;
  automatic_guest_approval: boolean;
  status?: string | null;
  privacy_mode: string;
  about?: string | null;
  photos_count: number;
  videos_count: number;
  videos_granted: number | null;
  photos_granted: number | null;
};

export class MemoryMapper {
  static toPersistence(input: Memory): MemoryRow {
    return {
      id: input.getId(),
      name: input.getName() ?? null,
      start_date: input.getStartDate() ?? null,
      cover_image: input.getCoverImageName() ?? null,
      selected_plan_id: input.getSelectedPlanId() ?? null,
      user_id: input.getUserId(),
      automatic_guest_approval: input.getAutomaticGuestApproval() ?? true,
      status: input.getStatus(),
      privacy_mode: input.getPrivacyMode(),
      about: input.getAbout() ?? null,
      photos_count: input.getPhotosCount(),
      videos_count: input.getVideosCount(),
      photos_granted: input.getPhotosGranted() ?? null,
      videos_granted: input.getVideosGranted() ?? null,
    };
  }

  static toEntity(input: MemoryRow): Memory {
    return Memory.build({
      id: input.id,
      name: input.name ?? undefined,
      startDate: input.start_date ?? undefined,
      selectedPlanId: input.selected_plan_id ?? undefined,
      userId: input.user_id,
      about: input.about ?? undefined,
      privacyMode: input.privacy_mode,
      status: input.status as any,
      photosCount: input.photos_count,
      videosCount: input.videos_count,
      videosGranted: input.videos_granted ?? undefined,
      photosGranted: input.photos_granted ?? undefined,
      automaticGuestApproval: input.automatic_guest_approval,
      coverImage: input.cover_image
        ? Image.build({
            name: input.cover_image,
            mimetype: "image/png",
            size: 0,
          })
        : undefined,
    });
  }
}
