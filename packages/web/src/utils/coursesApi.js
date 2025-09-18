import axiosAPI from './network';

export const getCourses = async (skip, limit, name, levels, durationRange) => {
  try {
    const response = await axiosAPI.get('/courses', {
      params: {
        skip,
        limit,
        name,
        levels,
        durationRange,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Get courses error:', error);
    throw error;
  }
};

export const createCourse = async (data) => {
  try {
    const response = await axiosAPI.post('/courses', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Get courses error:', error);
    throw error;
  }
};

export const getCourse = async (id) => {
  try {
    const response = await axiosAPI.get(`/courses/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Get course error:', error);
    throw error;
  }
};

export const createCheckoutSession = async (course) => {
  try {
    const response = await axiosAPI.post('/courses/create-checkout-session', { course });
    return response?.data;
  } catch (error) {
    console.log('Create chekcout session error:', error);
    throw error;
  }
};

export const getCourseLesson = async (courseId, lessonId) => {
  try {
    const response = await axiosAPI.get(`/courses/${courseId}/${lessonId}`);
    return response?.data;
  } catch (error) {
    console.error('Get course lesson error:', error);
    throw error;
  }
};

export const createCourseLesson = async (id, data) => {
  try {
    const response = await axiosAPI.post(`/courses/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error('Post course lesson error:', error);
    throw error;
  }
};

export const buyCourse = async (id) => {
  try {
    const response = await axiosAPI.post(`/courses/buy/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Buy course error:', error);
    throw error;
  }
};

export const markAsCompleted = async (id, data) => {
  try {
    const response = await axiosAPI.post(`/courses/mark/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error('Mark course lesson error:', error);
    throw error;
  }
};

export const getMyCourses = async (params) => {
  try {
    const response = await axiosAPI.get('/courses/my', { params });
    return response?.data;
  } catch (error) {
    console.error('Get my courses error:', error);
    throw error;
  }
};
