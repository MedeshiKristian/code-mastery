import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from './courseEntity';
import { CompletedLesson } from './completedLesson';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  lesson_id: number;

  @ManyToOne(() => Course, course => course.lessons, { nullable: false })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  lecture: string;

  @Column({
    type: 'json',
    nullable: true,
    default: []
  })
  tasks: {
    title: string;
    answer: string;
  }[];

  @Column({
    type: 'json',
    nullable: true,
    default: []
  })
  tests: {
    questionText: string;
    options: string[];
    correctOptionIndex: number;
  }[];

  @Column({
    type: 'json',
    nullable: true,
    default: []
  })
  attachments: {
    path: string;
    originalName: string;
  }[];

  @OneToMany(() => CompletedLesson, completedLesson => completedLesson.lesson)
  completedLessons: CompletedLesson[];
}

export default Lesson;
