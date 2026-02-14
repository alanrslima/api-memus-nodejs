import { MysqlDataSource } from "../../../../common";
import {
  MediaRegistryQuery,
  MediaRegistryQueryListByUserIdInput,
  MediaRegistryQueryListByUserIdOutput,
} from "../../../application/contract/query/media-registry-query";

import { StorageR2Gateway } from "../../gateway/r2/storage-r2-gateway";

export class MediaRegistryMysqlQuery implements MediaRegistryQuery {
  async listByUserId(
    input: MediaRegistryQueryListByUserIdInput,
  ): Promise<MediaRegistryQueryListByUserIdOutput[]> {
    const sql = `SELECT 
        b.id,
        b.name as filename,
        b.mimetype,
        b.size,
        b.status,
        b.created_at as createdAt
      FROM memory a
      INNER JOIN media_registry b ON a.id = b.memory_id
      WHERE user_id = ? AND b.status = 'ready'
      ORDER BY b.created_at DESC
      LIMIT 20`;
    const data =
      await MysqlDataSource.getInstance().query<MediaRegistryQueryListByUserIdOutput>(
        sql,
        [input.userId],
      );
    const expiresIn = 3600;
    const promises = data.map(async (media) => {
      const expiresAt = this.addSeconds(new Date(), expiresIn).toISOString();
      const { url } = await new StorageR2Gateway().getSignedGetUrl(
        media.filename,
        { expiresIn },
      );
      return { ...media, expiresAt, url };
    });
    return Promise.all(promises);
  }

  private addSeconds(date: Date, seconds: number) {
    const newDate = new Date(date);
    newDate.setSeconds(newDate.getSeconds() + seconds);
    return newDate;
  }
}
