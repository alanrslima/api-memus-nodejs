import { ID } from "../../../common";
import { Address } from "../../../geolocation";
import { LimitMediaRegistryError } from "../../error/limit-media-registry-error";
import { MemoryNotReadyError } from "../../error/memory-not-ready-error";
import { MemoryStatus } from "../enum/memory-status";
import { MemoryPrivacyMode } from "../value-object/memory-privacy-mode";
import { Mimetype } from "../value-object/mimetype";
import { NaturalNumber } from "../value-object/natural-number";
import { Guest } from "./guest";
import { Image } from "./image";
import { MediaRegistry } from "./media-registry";
import { MemoryOrder } from "./memory-order";
import { Plan } from "./plan";

type CreateProps = {
  name?: string;
  startDate?: Date;
  selectedPlanId?: string;
  userId: string;
  address?: Address;
  about?: string;
  coverImage?: Image;
  isPrivate?: boolean;
  guests?: Array<Guest>;
  privacyMode?: string;
  photosGranted?: number;
  videosGranted?: number;
};

type BuildProps = CreateProps & {
  id: string;
  privacyMode: string;
  status: MemoryStatus;
  photosCount: number;
  videosCount: number;
  automaticGuestApproval: boolean;
};

export class Memory {
  private id: ID;
  private name?: string;
  private startDate?: Date;
  // private plan?: Plan;
  /** ID do plano selecionado durante a criação do album de memorias */
  private selectedPlanId?: ID;
  private userId: ID;
  private address?: Address;
  private coverImage?: Image;
  private status: MemoryStatus;
  private photosCount: number;
  private videosCount: number;
  private privacyMode: MemoryPrivacyMode;
  private about?: string;
  private automaticGuestApproval: boolean;
  /** Quantidade máxima de fotos disponível no album de memorias após contratação do plano */
  private photosGranted?: NaturalNumber;
  /** Quantidade máxima de videos disponível no album de memorias após contratação do plano */
  private videosGranted?: NaturalNumber;

  private guests: Array<Guest> = [];

  private constructor(props: BuildProps) {
    this.id = new ID(props.id);
    this.name = props.name;
    this.selectedPlanId = props.selectedPlanId
      ? new ID(props.selectedPlanId)
      : undefined;
    this.startDate = props.startDate;
    this.userId = new ID(props.userId);
    this.status = props.status;
    this.photosCount = props.photosCount;
    this.videosCount = props.videosCount;
    this.address = props.address;
    this.coverImage = props.coverImage;
    this.guests = props.guests || [];
    this.privacyMode = new MemoryPrivacyMode(props.privacyMode);
    this.about = props.about;
    this.automaticGuestApproval = props.automaticGuestApproval;
    this.photosGranted = props.photosGranted
      ? new NaturalNumber(props.photosGranted)
      : undefined;
    this.videosGranted = props.videosGranted
      ? new NaturalNumber(props.videosGranted)
      : undefined;
  }

  static create(props: CreateProps) {
    return new Memory({
      ...props,
      id: new ID().getValue(),
      status: MemoryStatus.DRAFT,
      privacyMode: props.privacyMode ?? "PRIVATE",
      videosCount: 0,
      photosCount: 0,
      automaticGuestApproval: true,
    });
  }

  static build(props: BuildProps) {
    return new Memory(props);
  }

  inviteUser(userId: string) {
    if (userId === this.getUserId())
      throw new Error("The owner can not be invited");
    const existing = this.guests.find((i) => i.getUserId() === userId);
    if (existing) return;
    const guest = Guest.create({ userId });
    if (this.automaticGuestApproval) {
      guest.accept();
    }
    this.guests.push(guest);
  }

  denyGuest(guestId: string) {
    this.guests.forEach((guest) => {
      if (guest.getUserId() === guestId) {
        guest.deny();
      }
    });
  }

  acceptGuest(guestId: string) {
    this.guests.forEach((guest) => {
      if (guest.getUserId() === guestId) {
        guest.accept();
      }
    });
  }

  canSelectPlan(): boolean {
    return (
      this.getStatus() === MemoryStatus.DRAFT ||
      this.getStatus() === MemoryStatus.PENDING_PAYMENT
    );
  }

  canAccess(userId: string): boolean {
    const isOwner = this.userId.getValue() === userId;
    const isGuest = this.guests.some(
      (guest) => guest.getUserId() === userId && guest.isAccepted(),
    );
    return isGuest || isOwner;
  }
  // updateGuestStatus(guestId: string, status: string, userId: string) {
  //   const canUpdate = this.canUpdateGuestStatus(userId);
  //   if (!canUpdate) throw new ForbiddenError();
  //   const guest = this.getGuestById(guestId);
  // guest.setStatus(status);
  // }

  // private canUpdateGuestStatus(userId: string): boolean {
  //   if (userId === this.getUserId()) return true;
  //   return false;
  // }

  getId(): string {
    return this.id.getValue();
  }

  getAutomaticGuestApproval(): boolean | undefined {
    return this.automaticGuestApproval;
  }

  setAutomaticGuestApproval(automaticGuestApproval: boolean) {
    this.automaticGuestApproval = automaticGuestApproval;
  }

  getName(): string | undefined {
    return this.name;
  }

  getPhotosGranted(): number | undefined {
    return this.photosGranted?.getValue();
  }

  getVideosGranted(): number | undefined {
    return this.videosGranted?.getValue();
  }

  getStatus() {
    return this.status;
  }

  setName(name: string) {
    this.name = name;
  }

  getGuests(): Guest[] {
    return this.guests;
  }

  getStartDate(): Date | undefined {
    return this.startDate;
  }

  setAddress(address: Address) {
    this.address = address;
  }

  setStartDate(startDate: Date) {
    this.startDate = startDate;
  }

  setAbout(about: string) {
    this.about = about;
  }

  getAbout(): string | undefined {
    return this.about;
  }

  getSelectedPlanId(): string | undefined {
    return this.selectedPlanId?.getValue();
  }

  getPrivacyMode(): string {
    return this.privacyMode.getValue();
  }

  getUserId(): string {
    return this.userId.getValue();
  }

  getPhotosCount() {
    return this.photosCount;
  }

  getVideosCount() {
    return this.videosCount;
  }

  getCoverImageName(): string | undefined {
    return this.coverImage?.getName();
  }

  getAddress(): Address | undefined {
    return this.address;
  }

  updateRegistryCounter(registry: MediaRegistry) {
    if (registry.isPhoto()) {
      this.photosCount += 1;
    } else if (registry.isVideo()) {
      this.videosCount += 1;
    }
  }

  selectPlan(plan: Plan) {
    this.selectedPlanId = new ID(plan.getId());
  }

  setCoverImage(coverImage: Image) {
    this.coverImage = coverImage;
  }

  confirmPayment(order: MemoryOrder) {
    this.videosGranted = new NaturalNumber(
      order.getMemoryPlan().getVideosLimit(),
    );
    this.photosGranted = new NaturalNumber(
      order.getMemoryPlan().getPhotosLimit(),
    );
    this.status = MemoryStatus.ACTIVE;
  }

  failedPayment() {
    this.status = MemoryStatus.PAYMENT_FAILED;
  }

  pendingPayment() {
    this.status = MemoryStatus.PENDING_PAYMENT;
  }

  paymentInProgress() {
    this.status = MemoryStatus.PAYMENT_IN_PROGRESS;
  }

  suspended() {
    this.status = MemoryStatus.SUSPENDED;
  }

  archived() {
    this.status = MemoryStatus.ARCHIVED;
  }

  deleted() {
    this.status = MemoryStatus.DELETED;
  }

  createMediaRegistry(
    mimetype: string,
    size: number,
    personaId: string,
    userId: string,
  ): MediaRegistry {
    if (this.isFull(mimetype)) throw new LimitMediaRegistryError();
    if (!this.isActive()) throw new MemoryNotReadyError();
    const mediaRegistry = MediaRegistry.create({
      memoryId: this.id.getValue(),
      mimetype,
      userId,
      size,
      personaId,
    });
    this.updateRegistryCounter(mediaRegistry);
    return mediaRegistry;
  }

  private isActive() {
    return this.status === MemoryStatus.ACTIVE;
  }

  private isFull(mimetype: string): boolean {
    const type = new Mimetype(mimetype);
    if (type.isPhoto()) {
      if (!this.photosGranted) return false;
      return this.photosCount > this.photosGranted.getValue();
    } else if (type.isVideo()) {
      if (this.videosGranted === undefined) return false;
      return this.videosCount > this.videosGranted.getValue();
    }
    return true;
  }
}
