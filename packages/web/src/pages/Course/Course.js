import React from 'react';
import { useQuery } from 'react-query';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaLock } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Loading from '../Loading';
import CourseAbout from './CourseAbout';
import CourseLesson from './CourseLesson';
import { getCourse } from '../../utils/coursesApi';
import './Course.scss';

function Course() {
  const [t] = useTranslation('global');
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonParam = searchParams.get('lesson');
  const userId = useSelector((store) => store.auth.user?.userId);
  const { data, isLoading } = useQuery(`${userId}/courses/${id}`, async () => getCourse(id));
  const { course, lessons } = data ?? {};

  const setLesson = (lesson) => {
    setSearchParams((prev) => ({ ...prev, lesson }));
  };

  if (isLoading) {
    return <Loading className="w-full" />;
  }

  return (
    <div className="page-wrapper w-full flex-row">
      <div className="flex flex-col gap-2 w-1/4">
        <button
          type="button"
          onClick={() => setLesson('')}
          className="sidebar-tab"
        >
          {t('courses.about')}
        </button>
        {lessons?.map((lesson) => (
          <React.Fragment key={lesson.title}>
            <div className="divider-x" />
            <button
              type="button"
              onClick={() => setLesson(lesson.lesson_id)}
              className={`sidebar-tab flex items-center justify-center relative
                ${course.isBought ? 'bg-primary' : 'bg-secondary pointer-events-none'}`}
            >
              {lesson.title}
              <FaLock className="absolute right-3" hidden={course.isBought} />
              <FaCheck className="absolute right-3" hidden={!lesson.isPassed} />
            </button>
          </React.Fragment>
        ))}
        {course.isAuthor && (
        <>
          <div className="divider-x" />
          <Link
            to={`/courses/${id}/add`}
            className="sidebar-tab text-center"
          >
            {t('courses.addLesson')}
          </Link>
        </>
        )}
      </div>
      <div className="divider-y mx-2" />
      <div className="w-full">
        {lessonParam ? <CourseLesson id={lessonParam} /> : <CourseAbout course={course} />}
      </div>
    </div>
  );
}

export default Course;
