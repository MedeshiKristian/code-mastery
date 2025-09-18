import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import Course from './courseEntity';
import { CompletedLesson } from './completedLesson';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({
    length: 255,
    unique: true
  })
  email: string;

  @Column({
    length: 255
  })
  password: string;

  @Column({
    type: "enum",
    enum: ['student', 'teacher'],
    default: 'student'
  })
  role: string;

  @Column({
    type: 'text',
    nullable: true,
    default: 'uploads/1714551553896.jpg'
  })
  avatar_url: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  first_name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  last_name: string;

  @OneToMany(() => Course, course => course.author)
  lessons: Course[];

  @OneToMany(() => CompletedLesson, completedLesson => completedLesson.user)
  completedLessons: CompletedLesson[];
}