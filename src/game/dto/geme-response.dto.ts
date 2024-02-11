import { Field, ObjectType } from '@nestjs/graphql';
import { PLayer } from '../../player/player.entity';
import { Game } from '../game.entity';
import { PlayerResponseDto } from '../../player/dto/player-response.dto';

@ObjectType()
export class GameResponseDTO {
  @Field(() => Game)
  game: Game;

  @Field(() => [PlayerResponseDto])
  players: PlayerResponseDto[];

  @Field(() => PlayerResponseDto)
  player: PlayerResponseDto;
}
