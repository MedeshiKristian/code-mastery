import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import { loadStripe } from '@stripe/stripe-js';
import Image from '../../components/Image';
import { createCheckoutSession } from '../../utils/coursesApi';

function CourseAbout({ course }) {
  const [t] = useTranslation('global');

  const makePayment = async () => {
    const stripe = await loadStripe('pk_test_51PCMXqB831u4GIK9VSSQyVR3Uqg2H48ftJZWruFUQCWpDOs2T5XKBVhhd5Kn876d5GcTzWyH9xLgGN9hjXl8LZB500xFBSNE7E');

    const session = await createCheckoutSession(course);

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error('Stripe redirect error: ', result);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex gap-5 w-full">
        <Image imageSrc={course.image} className="!w-[300px] !h-[168px]" />
        <div className="flex flex-col">
          <div className="flex items-center justify-between w-full gap-10">
            <h1 className="heading-m">{course.name}</h1>
            <button
              type="button"
              className="button-primary whitespace-nowrap px-5 cursor-pointer"
              hidden={course.isBought}
              onClick={makePayment}
            >
              {t('courses.buy')}
              {' '}
              {course.price}
              $
              {' '}
            </button>
          </div>
          <small className="body-text-s">{course.instructors}</small>
          <p className="body-text-s text-[#808080]">
            {course.duration}
            {' '}
            {t('courses.hours')}
          </p>
          <p className="body-text-s">
            {t(`courses.${course.level}`)}
          </p>
        </div>
      </div>
      <div className="body-text-m">
        <ReactQuill
          value={course.description}
          readOnly
          modules={{ toolbar: false }}
        />
      </div>
    </div>
  );
}

export default CourseAbout;
