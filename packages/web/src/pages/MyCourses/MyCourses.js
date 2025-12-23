/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Image from '../../components/Image';
import Pagination from '../../components/Pagination';
import { getMyCourses } from '../../utils/coursesApi';
import Loader from '../../components/Loader';

function MyCourses() {
  const [t] = useTranslation('global');
  const limit = 12;
  const [searchParams] = useSearchParams();
  const [skip, setSkip] = useState(Math.max(0, limit * ((searchParams.get('page') ?? 1) - 1)));
  const userId = useSelector((store) => store.auth.user?.userId);
  const { data } = useQuery([`${userId}/courses/my`, skip], () => getMyCourses({ skip, limit }));
  const { courses, totalCount } = data ?? {};

  return (
    <div className="page-wrapper w-full gap-10">
      <h1 className="heading-m">{t('myCourses')}</h1>

      {!courses ? (
        // Case 1: Still Loading
        <div className="flex w-full h-full justify-center items-center">
          <Loader />
        </div>
      ) : courses.length === 0 ? (
        // Case 2: Data loaded, but array is empty
        <div className="flex flex-col items-center justify-center w-full py-20 gap-4">
          <p className="body-text-m text-gray-500">
            {t('noCoursesEnrolled', "You haven't enrolled to any courses yet.")}
          </p>
          <Link to="/" className="text-lightPurple hover:underline">
            {t('browseCourses', 'Browse available courses')}
          </Link>
        </div>
      ) : (
        // Case 3: Data exists
        <div className="contents">
          <div className="flex flex-wrap gap-6 justify-between">
            {courses.map((course) => (
              <Link
                to={`/courses/${course.course_id}`}
                key={course.course_id}
                className="flex flex-col gap-2 justify-start rounded-[4px]
                  items-center w-[250px] px-2 hover:bg-secondary"
              >
                <div className="flex flex-col items-center">
                  <div className="w-[250px] h-[140px]"><Image imageSrc={course.image} /></div>
                  <div className="flex w-[240px] bg-lines h-1 mt-2">
                    <div
                      className="h-full bg-lightPurple"
                      style={{ width: `${course.total ? (100 * course.passed) / course.total : 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 w-full justify-between pb-2">
                  <p className="body-text-m">{course.name}</p>
                  <small className="body-text-s">
                    {course.total ? Math.round((100 * course.passed) / course.total) : 100}
                    %
                  </small>
                </div>
              </Link>
            ))}
          </div>
          <Pagination
            skip={skip}
            setSkip={setSkip}
            limit={limit}
            resultsLength={totalCount}
          />
        </div>
      )}
    </div>
  );
}

export default MyCourses;
