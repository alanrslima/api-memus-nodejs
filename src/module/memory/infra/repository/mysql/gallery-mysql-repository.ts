import { EntityManager } from "typeorm";
import { EntityId, env, PositiveNumber } from "../../../../common";
import { GalleryDTO } from "../../../application/contract/dto/gallery-dto";
import { GalleryRepository } from "../../../application/contract/repository/gallery-repository";
import { StorageR2Gateway } from "../../gateway/r2/storage-r2-gateway";

type MediaRegistryRow = {
  id: string;
  name: string;
  mimetype: string;
  url: string;
};

export class GalleryMysqlRepository implements GalleryRepository {
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  setManager(manager: EntityManager): void {
    this.manager = manager;
  }

  async paginateByMemoryId(
    memoryId: EntityId,
    page: PositiveNumber,
    perPage: PositiveNumber,
  ): Promise<GalleryDTO> {
    const offset = (page.getValue() - 1) * perPage.getValue();
    let query = `
      SELECT id, name, mimetype, url 
      FROM media_registry 
      WHERE memory_id = ? AND status = 'ready' 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?`;
    const mediaResponse = await this.manager.query<MediaRegistryRow[]>(query, [
      memoryId.getValue(),
      perPage.getValue(),
      offset,
    ]);
    query = `SELECT COUNT(*) as total FROM media_registry WHERE memory_id = ? AND status = 'ready'`;
    const [countResponse] = await this.manager.query<{ total: string }[]>(
      query,
      [memoryId.getValue()],
    );
    const storageR2Gateway = new StorageR2Gateway();
    const media = await Promise.all(
      mediaResponse.map(async (item) => {
        const { url } = await storageR2Gateway.getSignedGetUrl(item.name, {
          expiresIn: Number(env.READ_MEDIA_EXPIRES_IN),
        });
        return {
          id: item.id,
          name: item.name,
          mimetype: item.mimetype,
          url,
        };
      }),
    );
    return {
      data: media,
      page: page.getValue(),
      perPage: perPage.getValue(),
      total: Number(countResponse.total),
    };
  }
}
