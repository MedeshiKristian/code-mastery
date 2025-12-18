--
-- Database "code_mastery" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Ubuntu 14.18-1.pgdg22.04+1)
-- Dumped by pg_dump version 14.18 (Ubuntu 14.18-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: code_mastery; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE code_mastery WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';


ALTER DATABASE code_mastery OWNER TO postgres;

\connect code_mastery

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: Users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Users_role_enum" AS ENUM (
    'student',
    'teacher'
);


ALTER TYPE public."Users_role_enum" OWNER TO postgres;

--
-- Name: courses_level_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.courses_level_enum AS ENUM (
    'Beginner',
    'Intermediate',
    'Expert',
    'All levels'
);


ALTER TYPE public.courses_level_enum OWNER TO postgres;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'student',
    'teacher'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: completed_lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.completed_lessons (
    id integer NOT NULL,
    user_id integer,
    lesson_id integer
);


ALTER TABLE public.completed_lessons OWNER TO postgres;

--
-- Name: completed_lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.completed_lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.completed_lessons_id_seq OWNER TO postgres;

--
-- Name: completed_lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.completed_lessons_id_seq OWNED BY public.completed_lessons.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    course_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    price numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    duration integer DEFAULT 1 NOT NULL,
    level public.courses_level_enum NOT NULL,
    image character varying(255) NOT NULL,
    author_id integer NOT NULL,
    instructors text NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: courses_course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.courses_course_id_seq OWNER TO postgres;

--
-- Name: courses_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_course_id_seq OWNED BY public.courses.course_id;


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    lesson_id integer NOT NULL,
    lecture text,
    attachments json DEFAULT '[]'::json,
    tasks json DEFAULT '[]'::json,
    tests json DEFAULT '[]'::json
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: lessons_lesson_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lessons_lesson_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lessons_lesson_id_seq OWNER TO postgres;

--
-- Name: lessons_lesson_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lessons_lesson_id_seq OWNED BY public.lessons.lesson_id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    course_id integer,
    user_id integer,
    rating integer,
    comment text,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_review_id_seq OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.users_role_enum DEFAULT 'student'::public.users_role_enum NOT NULL,
    avatar_url text DEFAULT 'uploads/1714551553896.jpg'::text,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: completed_lessons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_lessons ALTER COLUMN id SET DEFAULT nextval('public.completed_lessons_id_seq'::regclass);


--
-- Name: courses course_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN course_id SET DEFAULT nextval('public.courses_course_id_seq'::regclass);


--
-- Name: lessons lesson_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons ALTER COLUMN lesson_id SET DEFAULT nextval('public.lessons_lesson_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: completed_lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.completed_lessons (id, user_id, lesson_id) FROM stdin;
4	6	8
5	10	8
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (course_id, name, description, price, duration, level, image, author_id, instructors) FROM stdin;
33	C Programming	Introduction to C programming.	49.99	30	Beginner	uploads/c.webp	6	John Doe, Jane Smith
34	Java Fundamentals	Comprehensive Java course.	59.99	45	Intermediate	uploads/java.webp	6	John Doe, Jane Smith
35	JavaScript Essentials	Learn JavaScript from scratch.	39.99	30	Beginner	uploads/javascript.webp	6	John Doe, Jane Smith
36	Kotlin for Android	Develop Android apps with Kotlin.	70.00	50	Expert	uploads/kotlin.webp	6	John Doe, Jane Smith
37	Python Programming	Introduction to Python.	50.00	40	Beginner	uploads/python.webp	6	John Doe, Jane Smith
38	Swift for iOS	Build iOS apps using Swift.	65.00	50	Expert	uploads/swift.webp	6	John Doe, Jane Smith
39	Advanced C++	Deep dive into C++ programming.	70.00	40	Expert	uploads/cpp.webp	6	John Doe, Jane Smith
40	Ruby on Rails	Comprehensive Ruby on Rails course.	65.00	45	Intermediate	uploads/ruby.webp	6	John Doe, Jane Smith
41	Data Structures	Essential data structures for software development.	60.00	35	Intermediate	uploads/data-structures.webp	6	John Doe, Jane Smith
42	Algorithms	Algorithmic techniques and principles.	75.00	50	Expert	uploads/algorithms.webp	6	John Doe, Jane Smith
43	HTML & CSS	Web development from scratch.	30.00	25	Beginner	uploads/html-css.webp	6	John Doe, Jane Smith
44	React Development	Building applications with React.	80.00	50	Intermediate	uploads/react.webp	6	John Doe, Jane Smith
45	Node.js	Server-side development with Node.js.	90.00	60	Expert	uploads/nodejs.webp	6	John Doe, Jane Smith
46	Angular Fundamentals	Mastering Angular for front-end development.	85.00	45	Intermediate	uploads/angular.webp	6	John Doe, Jane Smith
47	Full-stack JavaScript	Learn full-stack development with JavaScript.	95.00	70	All levels	uploads/fullstack-js.webp	6	John Doe, Jane Smith
48	Cloud Computing Basics	Introduction to cloud computing.	50.00	30	Beginner	uploads/cloud-computing.webp	6	John Doe, Jane Smith
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (course_id, title, lesson_id, lecture, attachments, tasks, tests) FROM stdin;
33	Writing a Simple C++ Program	8	<iframe class="ql-video ql-align-center" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/imNlJohlLPk?showinfo=0"></iframe><h3>  C++ Programming: Writing a Simple C++ Program Topics discussed: </h3><ol><li>Basic introduction to the ‘main’ function. </li><li>Elements of a function definition. </li><li>An example of a complete C++ Program. </li><li>Introduction to the concept of “Types”. <span style="color: rgb(255, 255, 255);">f a complete C+</span></li></ol><h3>\tIn this lecture, we explore the fundamentals of writing a simple C++ program. The session begins with an introduction to the 'main' function, the entry point of any C++ application. We then delve into the elements of a function definition, highlighting syntax and structure. An example of a complete C++ program is provided to illustrate these concepts in practice. Finally, the lecture introduces the concept of “Types”, explaining their significance and usage in C++ programming.<span style="color: rgb(255, 255, 255);">t of “Types”.</span></h3><p><br></p>	[]	[]	[{"questionText":"<p>What is the entry point of a C++ program?</p>","options":["#include","\\"main\\" function","int","return"],"correctOptionIndex":1},{"questionText":"<p>What keyword is used to indicate the end of a statement?</p>","options":[":",";",".",","],"correctOptionIndex":1}]
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, course_id, user_id, rating, comment) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, password, role, avatar_url, first_name, last_name) FROM stdin;
6	email@x.com	$2b$10$1306OB1PNXoNhCjgoRWev.3oU6uQejfETcH6T4cNdltPb8ziPRTyy	teacher	uploads/1714551553896.jpg	Name	Surname
10	example@email.com	$2b$10$fPpInc0VHXEfnK7/JvicPeARxpgFaMhccogHVj5DeEBbSeHkGMcxW	teacher	uploads/1716462347444.jpg	Bob	Smith
\.


--
-- Name: completed_lessons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.completed_lessons_id_seq', 5, true);


--
-- Name: courses_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_course_id_seq', 48, true);


--
-- Name: lessons_lesson_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lessons_lesson_id_seq', 8, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 10, true);


--
-- Name: completed_lessons PK_0650b48221745847691c6248cee; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_lessons
    ADD CONSTRAINT "PK_0650b48221745847691c6248cee" PRIMARY KEY (id);


--
-- Name: courses PK_42dc69837b2e7bc603686ddaf53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "PK_42dc69837b2e7bc603686ddaf53" PRIMARY KEY (course_id);


--
-- Name: lessons PK_738fd696873afdde0c2ee567a01; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "PK_738fd696873afdde0c2ee567a01" PRIMARY KEY (lesson_id);


--
-- Name: users PK_96aac72f1574b88752e9fb00089; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY (user_id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: completed_lessons FK_2996be8890eef643cdf4b9199ce; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_lessons
    ADD CONSTRAINT "FK_2996be8890eef643cdf4b9199ce" FOREIGN KEY (lesson_id) REFERENCES public.lessons(lesson_id);


--
-- Name: completed_lessons FK_32b39cca4ea3abc658b1946b3de; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_lessons
    ADD CONSTRAINT "FK_32b39cca4ea3abc658b1946b3de" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: lessons FK_3c4e299cf8ed04093935e2e22fe; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "FK_3c4e299cf8ed04093935e2e22fe" FOREIGN KEY (course_id) REFERENCES public.courses(course_id);


--
-- Name: courses FK_cce7a734fa75f9f3051c50d3283; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "FK_cce7a734fa75f9f3051c50d3283" FOREIGN KEY (author_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--
