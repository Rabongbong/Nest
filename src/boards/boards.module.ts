import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardCategory } from './entities/board-category';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardCategory])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
