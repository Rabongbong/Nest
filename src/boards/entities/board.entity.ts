import { User } from '@src/users/entities/user.entity';
import { Comment } from '@src/comments/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardCategory } from './board-category.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.boards, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne(() => BoardCategory, (category) => category.boards, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  categoryId: number;

  @OneToMany(() => Comment, (comment) => comment.board)
  comments: Comment[];
}
