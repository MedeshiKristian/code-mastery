import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './userEntity';
import { Lesson } from './lessonEntity';

@Entity('completed_lessons')
export class CompletedLesson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.completedLessons)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Lesson, lesson => lesson.completedLessons)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
