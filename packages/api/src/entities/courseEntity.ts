import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './userEntity';
import levels from '../constants/validLevels';
import Lesson from './lessonEntity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  course_id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false
  })
  description: string;
  
  @Column({
    type: 'text',
    nullable: false
  })
  instructors: string;

  @Column({
    type: 'decimal',
    nullable: false,
    precision: 10,
    scale: 2,
    default: 0
  })
  price: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 1,
    unsigned: true
  })
  duration: number;

  @Column({
    type: 'enum',
    enum: levels,
    nullable: false
  })
  level: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  image: string;

  @ManyToOne(() => User, user => user.user_id, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => Lesson, lesson => lesson.course)
  lessons: Lesson[];
}

export default Course;
