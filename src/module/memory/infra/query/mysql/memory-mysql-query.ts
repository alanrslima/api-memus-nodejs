import { env, MysqlDataSource } from "../../../../common";
import {
  MemoryQuery,
  MemoryQueryDetailInput,
  MemoryQueryDetailOutput,
  MemoryQueryGetGuestInput,
  MemoryQueryGetGuestOutput,
  MemoryQueryListInput,
  MemoryQueryListGalleryInput,
  MemoryQueryListGalleryOutput,
  MemoryQueryListOutput,
  MemoryQueryResumeInput,
  MemoryQueryResumeOutput,
} from "../../../application/contract/query/memory-query";
import { StorageR2Gateway } from "../../gateway/r2/storage-r2-gateway";

export class MemoryMysqlQuery implements MemoryQuery {
  private dataSource = MysqlDataSource.getInstance();

  async getGuest(
    input: MemoryQueryGetGuestInput,
  ): Promise<MemoryQueryGetGuestOutput> {
    const sql = `SELECT status, created_at as createdAt FROM memory_guest WHERE user_id = ? and memory_id = ?`;
    const [response] = await this.dataSource.query(sql, [
      input.userId,
      input.memoryId,
    ]);
    return response;
  }

  private formatAddressResponse(data: any) {
    if (!data.address_id) return undefined;
    const formattedAddress = [
      data.address_address_line1,
      data.address_address_line2,
    ]
      .filter((i) => i?.length)
      .join(", ");
    return {
      id: data.address_id,
      addressLine1: data.address_address_line1,
      addressLine2: data.address_address_line2,
      neighborhood: data.address_neighborhood,
      city: data.address_city,
      country: data.address_country,
      countryCode: data.address_country_code,
      postcode: data.address_postcode,
      state: data.address_state,
      longitude: data.address_longitude,
      latitude: data.address_latitude,
      formatted: formattedAddress,
    };
  }

  private formatListResponse(data: any) {
    return {
      id: data.id,
      name: data.name,
      privacyMode: data.privacyMode,
      startDate: data.startDate,
      photosCount: data.photosCount,
      videosCount: data.videosCount,
      status: data.status,
      coverImage: data.coverImage,
      address: this.formatAddressResponse(data),
    };
  }

  async list(input: MemoryQueryListInput): Promise<MemoryQueryListOutput> {
    const sql = `SELECT 
      a.id, 
      a.name, 
      a.privacy_mode as privacyMode,
      a.start_date as startDate, 
      a.photos_count as photosCount, 
      a.videos_count as videosCount, 
      a.status,
      a.cover_image as coverImage,
      b.id as address_id,
      b.address_line1 as address_address_line1,
      b.address_line2 as address_address_line2,
      b.neighborhood as address_neighborhood,
      b.city as address_city,
      b.country as address_country,
      b.country_code as address_country_code,
      b.postcode as address_postcode,
      b.state as address_state,
      b.longitude as address_longitude,
      b.latitude as address_latitude
      FROM memory a 
      LEFT JOIN memory_address b ON a.id = b.memory_id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC`;
    const response = await this.dataSource.query(sql, [input.userId]);
    const storageR2Gateway = new StorageR2Gateway();
    const data = await Promise.all(
      response.map(async (item: any) => {
        if (item.coverImage) {
          const coverImage = await storageR2Gateway.getSignedGetUrl(
            item.coverImage,
            { expiresIn: Number(env.READ_MEDIA_EXPIRES_IN) },
          );
          return this.formatListResponse({ ...item, coverImage });
        }
        return this.formatListResponse(item);
      }),
    );
    return data;
  }

  async resume(
    input: MemoryQueryResumeInput,
  ): Promise<MemoryQueryResumeOutput> {
    let sql = `SELECT 
      a.id, 
      a.name, 
      a.privacy_mode as privacyMode,
      a.start_date as startDate, 
      a.cover_image as coverImage,
      b.id as address_id,
      b.address_line1 as address_address_line1,
      b.address_line2 as address_address_line2,
      b.neighborhood as address_neighborhood,
      b.city as address_city,
      b.country as address_country,
      b.country_code as address_country_code,
      b.postcode as address_postcode,
      b.state as address_state,
      b.longitude as address_longitude,
      b.latitude as address_latitude
      FROM memory a
      LEFT JOIN memory_address b ON a.id = b.memory_id
      WHERE a.id = ?`;
    const [response] = await this.dataSource.query(sql, [input.memoryId]);
    const coverImage = await this.getImageUrl(response?.coverImage);
    return {
      id: response.id,
      name: response.name,
      privacyMode: response.privacyMode,
      startDate: response.startDate,
      coverImage,
      address: this.formatAddressResponse(response),
    };
  }

  private async getImageUrl(
    name?: string,
  ): Promise<{ url: string; name: string } | undefined> {
    if (!name) return;
    const storageR2Gateway = new StorageR2Gateway();
    const signedUrl = await storageR2Gateway.getSignedGetUrl(name, {
      expiresIn: Number(env.READ_MEDIA_EXPIRES_IN),
    });
    return { url: signedUrl.url, name };
  }

  async detail(
    input: MemoryQueryDetailInput,
  ): Promise<MemoryQueryDetailOutput | undefined> {
    let sql = `SELECT 
      a.id, 
      a.name, 
      a.about,
      a.start_date, 
      a.automatic_guest_approval,
      a.privacy_mode,
      a.photos_count, 
      a.videos_count, 
      a.cover_image,
      a.status,
      a.created_at as createdAt,
      b.id as plan_id,
      b.name as plan_name,
      b.photos_limit,
      b.videos_limit,
      b.description as plan_description,
      b.currency_code as plan_currency_code,
      b.price_cents as plan_price,
      b.photos_limit as plan_photos_limit,
      b.videos_limit as plan_videos_limit,
      c.id as address_id,
      c.address_line1 as address_address_line1,
      c.address_line2 as address_address_line2,
      c.neighborhood as address_neighborhood,
      c.city as address_city,
      c.country as address_country,
      c.country_code as address_country_code,
      c.postcode as address_postcode,
      c.state as address_state,
      c.longitude as address_longitude,
      c.latitude as address_latitude
    FROM memory a 
    LEFT JOIN memory_plan b ON a.plan_id = b.id
    LEFT JOIN memory_address c ON a.id = c.memory_id
    WHERE a.id = ? and a.user_id = ?`;
    const [memoryResponse] = await this.dataSource.query(sql, [
      input.memoryId,
      input.userId,
    ]);
    if (!memoryResponse) return undefined;
    sql = `SELECT id, name, mimetype, url FROM media_registry WHERE memory_id = ? AND status = 'ready' ORDER BY created_at DESC LIMIT 20`;
    const mediaResponse = await this.dataSource.query(sql, [input.memoryId]);
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
    const coverImage = await this.getImageUrl(memoryResponse.cover_image);
    sql = `SELECT 
      a.user_id as id, 
      b.name,
      b.email,
      b.profile_url as profileUrl,
      a.status
    FROM memory_guest a 
    LEFT JOIN user b ON a.user_id = b.id
    WHERE a.memory_id = ?`;
    const guestsResponse = await this.dataSource.query(sql, [input.memoryId]);
    return {
      id: memoryResponse.id,
      startDate: memoryResponse.start_date,
      name: memoryResponse.name,
      automaticGuestApproval: Boolean(memoryResponse.automatic_guest_approval),
      status: memoryResponse.status,
      privacyMode: memoryResponse.privacy_mode,
      media: media,
      about: memoryResponse.about,
      guests: guestsResponse,
      coverImage,
      plan: memoryResponse.plan_id && {
        currencyCode: memoryResponse.plan_currencyCode,
        description: memoryResponse.plan_description,
        id: memoryResponse.plan_id,
        name: memoryResponse.plan_name,
        price: memoryResponse.plan_price,
        photosLimit: memoryResponse.photos_limit,
        videosLimit: memoryResponse.videos_limit,
      },
      address: this.formatAddressResponse(memoryResponse),
      videosCount: memoryResponse.videos_count,
      photosCount: memoryResponse.photos_count,
      createdAt: memoryResponse.createdAt,
      messages: [],
    };
  }

  async listGallery(
    input: MemoryQueryListGalleryInput,
  ): Promise<MemoryQueryListGalleryOutput> {
    const perPage = 50;
    const page = (input.page = 1);
    const offset = (page - 1) * perPage;
    let sql = `SELECT id, name, mimetype, url FROM media_registry WHERE memory_id = ? AND status = 'ready' ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const dataResponse = await this.dataSource.query(sql, [
      input.memoryId,
      perPage,
      offset,
    ]);
    sql = `SELECT COUNT(*) as total FROM media_registry WHERE memory_id = ? AND status = 'ready'`;
    const [countResponse] = await this.dataSource.query(sql, [input.memoryId]);
    return {
      data: dataResponse,
      page: 1,
      perPage: 50,
      total: Number(countResponse.total),
    };
  }
}
