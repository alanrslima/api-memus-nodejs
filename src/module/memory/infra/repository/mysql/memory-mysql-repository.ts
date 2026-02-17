import { EntityManager } from "typeorm";
import { MemoryRepository } from "../../../application/contract/repository/memory-repository";
import { Guest } from "../../../domain/entity/guest";
import { Image } from "../../../domain/entity/image";
import { Memory } from "../../../domain/entity/memory";
import { MemoryNotFoundError } from "../../../error/memory-not-found-error";
import { Address } from "../../../../geolocation";
import { MemoryMapper } from "./mapper/memory-mapper";

export class MemoryMysqlRepository implements MemoryRepository {
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  setManager(manager: EntityManager): void {
    this.manager = manager;
  }

  private async insertOrUpdateAddress(memory: Memory) {
    let sql = "";
    if (!memory.getAddress()) {
      sql = `DELETE FROM memory_address WHERE memory_id = ?`;
      await this.manager.query(sql, [memory.getId()]);
    } else {
      sql = `INSERT INTO memory_address (id, memory_id, address_line1, address_line2, neighborhood, city, country, country_code, postcode, state, longitude, latitude)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          id = VALUES(id),
           memory_id = VALUES(memory_id),
           address_line1 = VALUES(address_line1),
           address_line2 = VALUES(address_line2),
           neighborhood = VALUES(neighborhood),
           city = VALUES(city),
           country = VALUES(country),
           country_code = VALUES(country_code),
           postcode = VALUES(postcode),
           state = VALUES(state),
           longitude = VALUES(longitude),
           latitude = VALUES(latitude)`;
      await this.manager.query(sql, [
        memory.getAddress()?.getId(),
        memory.getId(),
        memory.getAddress()?.getAddressLine1(),
        memory.getAddress()?.getAddressLine2(),
        memory.getAddress()?.getNeighborhood(),
        memory.getAddress()?.getCity(),
        memory.getAddress()?.getCountry(),
        memory.getAddress()?.getCountryCode(),
        memory.getAddress()?.getPostcode(),
        memory.getAddress()?.getState(),
        memory.getAddress()?.getLongitude(),
        memory.getAddress()?.getLatitude(),
      ]);
    }
  }

  async create(memory: Memory): Promise<void> {
    const data = MemoryMapper.toPersistence(memory);
    let sql = `INSERT INTO memory (
      id, 
      automatic_guest_approval, 
      name, 
      about, 
      start_date, 
      selected_plan_id, 
      user_id, 
      status, 
      privacy_mode, 
      photos_count, 
      videos_count, 
      photos_granted,
      videos_granted,
      cover_image
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    await this.manager.query(sql, [
      data.id,
      data.automatic_guest_approval,
      data.name,
      data.about,
      data.start_date,
      data.selected_plan_id,
      data.user_id,
      data.status,
      data.privacy_mode,
      data.photos_count,
      data.videos_count,
      data.photos_granted,
      data.videos_granted,
      data.cover_image,
    ]);
    await this.insertOrUpdateAddress(memory);
    if (memory.getGuests().length) {
      const data = memory
        .getGuests()
        .map((guest) => [guest.getUserId(), memory.getId(), guest.getStatus()]);
      sql = `INSERT INTO memory_guest (user_id, memory_id, status) VALUES ?`;
      await this.manager.query(sql, [data]);
    }
  }

  private async getMemoryGuests(memoryId: string): Promise<Guest[]> {
    const sql = `SELECT status, user_id as userId FROM memory_guest WHERE memory_id = ?`;
    const response = await this.manager.query(sql, [memoryId]);
    return response.map(Guest.build);
  }

  async getById(id: string): Promise<Memory> {
    const sql = `SELECT a.id,
      a.name,
      a.about,
      a.start_date,
      a.selected_plan_id,
      a.user_id,
      a.status,
      a.automatic_guest_approval,
      a.privacy_mode,
      a.cover_image,
      a.photos_count,
      a.videos_count,
      d.id as address_id,
      d.address_line1 as address_address_line1,
      d.address_line2 as address_address_line2,
      d.neighborhood as address_neighborhood,
      d.city as address_city,
      d.country as address_country,
      d.country_code as address_country_code,
      d.postcode as address_postcode,
      d.state as address_state,
      d.longitude as address_longitude,
      d.latitude as address_latitude
    FROM memory a 
    LEFT JOIN memory_address d ON a.id = d.memory_id
    WHERE a.id = ?`;
    const [response] = await this.manager.query(sql, [id]);
    if (!response) throw new MemoryNotFoundError();
    let address: Address | undefined;
    if (response.address_id) {
      address = Address.build({
        id: response.address_id,
        addressLine1: response.address_address_line1,
        addressLine2: response.address_address_line2,
        neighborhood: response.address_neighborhood,
        city: response.address_city,
        country: response.address_country,
        countryCode: response.address_country_code,
        postcode: response.address_postcode,
        state: response.address_state,
        longitude: response.address_longitude,
        latitude: response.address_latitude,
        formatted: [
          response.address_address_line1,
          response.address_address_line2,
        ].join(", "),
      });
    }
    const guests = await this.getMemoryGuests(id);
    return Memory.build({
      id: response.id,
      guests,
      selectedPlanId: response.selected_plan_id,
      automaticGuestApproval: response.automatic_guest_approval,
      privacyMode: response.privacy_mode,
      startDate: response.start_date,
      about: response.about,
      name: response.name,
      photosCount: response.photos_count,
      status: response.status,
      userId: response.user_id,
      videosCount: response.videos_count,
      address,
      isPrivate: false,
      coverImage: response.cover_image
        ? Image.build({
            mimetype: "image/png",
            name: response.cover_image,
            size: 1000,
          })
        : undefined,
    });
  }

  async update(memory: Memory): Promise<void> {
    let sql = `UPDATE memory SET 
      automatic_guest_approval = ?, 
      name = ?, 
      about = ?, 
      start_date = ?, 
      privacy_mode = ?, 
      user_id = ?, 
      status = ?, 
      selected_plan_id = ?,
      photos_count = ?, 
      videos_count = ?, 
      photos_granted = ?, 
      videos_granted = ?, 
      cover_image = ? 
    WHERE id = ?`;
    const data = MemoryMapper.toPersistence(memory);
    await this.manager.query(sql, [
      data.automatic_guest_approval,
      data.name,
      data.about,
      data.start_date,
      data.privacy_mode,
      data.user_id,
      data.status,
      data.selected_plan_id,
      data.photos_count,
      data.videos_count,
      data.photos_granted,
      data.videos_granted,
      data.cover_image,
      data.id,
    ]);
    await this.insertOrUpdateAddress(memory);
    sql = `DELETE FROM memory_guest WHERE memory_id = ?`;
    await this.manager.query(sql, [memory.getId()]);
    if (memory.getGuests().length) {
      const data = memory
        .getGuests()
        .map((guest) => [guest.getUserId(), memory.getId(), guest.getStatus()]);
      sql = `INSERT INTO memory_guest (user_id, memory_id, status) VALUES ?`;
      await this.manager.query(sql, [data]);
    }
  }
}
