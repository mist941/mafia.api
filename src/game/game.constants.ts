import { PlayerRoles } from '../player/player.types';

export const ROLES_BY_NUMBER_OF_PLAYERS: { [key: number]: PlayerRoles[] } = {
  5: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.MAFIA,
    PlayerRoles.DOCTOR,
  ],
  6: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.GODFATHER,
  ],
  7: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
  ],
  8: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.SECRET_AGENT,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
  ],
  9: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.AVENGER,
    PlayerRoles.GUARDIAN,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
  ],
  10: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.AVENGER,
    PlayerRoles.BEAUTY,
    PlayerRoles.GUARDIAN,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
    PlayerRoles.MAFIA_LAWYER,
  ],
  11: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.SECRET_AGENT,
    PlayerRoles.AVENGER,
    PlayerRoles.BEAUTY,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
    PlayerRoles.MAFIA_LAWYER,
  ],
  12: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.SECRET_AGENT,
    PlayerRoles.AVENGER,
    PlayerRoles.BEAUTY,
    PlayerRoles.GUARDIAN,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
    PlayerRoles.MAFIA_LAWYER,
  ],
  13: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.SECRET_AGENT,
    PlayerRoles.AVENGER,
    PlayerRoles.BEAUTY,
    PlayerRoles.GUARDIAN,
    PlayerRoles.MAFIA,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
    PlayerRoles.MAFIA_LAWYER,
  ],
  14: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.SECRET_AGENT,
    PlayerRoles.AVENGER,
    PlayerRoles.BEAUTY,
    PlayerRoles.GUARDIAN,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
    PlayerRoles.TRIAD,
    PlayerRoles.SENSEI,
  ],
  15: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.SECRET_AGENT,
    PlayerRoles.AVENGER,
    PlayerRoles.BEAUTY,
    PlayerRoles.GUARDIAN,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
    PlayerRoles.TRIAD,
    PlayerRoles.SENSEI,
  ],
  16: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.SECRET_AGENT,
    PlayerRoles.AVENGER,
    PlayerRoles.BEAUTY,
    PlayerRoles.GUARDIAN,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
    PlayerRoles.TRIAD,
    PlayerRoles.SENSEI,
  ],
  17: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.SECRET_AGENT,
    PlayerRoles.AVENGER,
    PlayerRoles.BEAUTY,
    PlayerRoles.GUARDIAN,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
    PlayerRoles.TRIAD,
    PlayerRoles.SENSEI,
  ],
  18: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.SECRET_AGENT,
    PlayerRoles.AVENGER,
    PlayerRoles.BEAUTY,
    PlayerRoles.GUARDIAN,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
    PlayerRoles.MAFIA_LAWYER,
    PlayerRoles.TRIAD,
    PlayerRoles.TRIAD,
    PlayerRoles.SENSEI,
  ],
  19: [
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.PEACEFUL_RESIDENT,
    PlayerRoles.COMMISSAR,
    PlayerRoles.DOCTOR,
    PlayerRoles.SECRET_AGENT,
    PlayerRoles.AVENGER,
    PlayerRoles.BEAUTY,
    PlayerRoles.GUARDIAN,
    PlayerRoles.MAFIA,
    PlayerRoles.GODFATHER,
    PlayerRoles.MAFIA_LAWYER,
    PlayerRoles.TRIAD,
    PlayerRoles.TRIAD,
    PlayerRoles.SENSEI,
  ],
};

export const ORDER_OF_PLAY: PlayerRoles[] = [
  PlayerRoles.BEAUTY,
  PlayerRoles.MAFIA,
  PlayerRoles.AVENGER,
  PlayerRoles.DOCTOR,
  PlayerRoles.GUARDIAN,
  PlayerRoles.COMMISSAR,
  PlayerRoles.MAFIA_LAWYER,
  PlayerRoles.GODFATHER,
  PlayerRoles.SENSEI,
];

export const LAST_ROLE_BY_NUMBER_OF_PLAYERS: { [key: number]: PlayerRoles } = {
  5: PlayerRoles.DOCTOR,
  6: PlayerRoles.GODFATHER,
  7: PlayerRoles.GODFATHER,
  8: PlayerRoles.GODFATHER,
  9: PlayerRoles.GODFATHER,
  10: PlayerRoles.GODFATHER,
  11: PlayerRoles.GODFATHER,
  12: PlayerRoles.GODFATHER,
  13: PlayerRoles.GODFATHER,
  14: PlayerRoles.SENSEI,
  15: PlayerRoles.SENSEI,
  16: PlayerRoles.SENSEI,
  17: PlayerRoles.SENSEI,
  18: PlayerRoles.SENSEI,
  19: PlayerRoles.SENSEI,
};