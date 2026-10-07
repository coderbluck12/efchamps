export enum UserRole {
  PLAYER = 'PLAYER',
  ADMIN = 'ADMIN',
}

export enum Platform {
  PS5 = 'PS5',
  XBOX = 'Xbox',
  PC = 'PC',
  MOBILE = 'Mobile',
}

export enum MatchStatus {
  OPEN = 'OPEN',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESULT_PENDING = 'RESULT_PENDING',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}

export enum TournamentStatus {
  OPEN = 'OPEN',
  STARTING = 'STARTING',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum DisputeStatus {
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  STAKE_LOCKED = 'STAKE_LOCKED',
  PRIZE_WON = 'PRIZE_WON',
  STAKE_REFUNDED = 'STAKE_REFUNDED',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ESCROW = 'ESCROW',
}
