import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Course } from '../../entities/courseEntity'; // Adjust path
import { User } from '../../entities/userEntity';     // Adjust path

export default class CourseSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    const courseRepository = dataSource.getRepository(Course);
    const userRepository = dataSource.getRepository(User);

    const author = await userRepository.findOne({ 
      where: { role: 'teacher' } 
    });

    
    if (!author) {
      console.warn('No teacher found. Please seed users with role="teacher" first.');
      return;
    }

    const coursesData = [
      {
        name: "C Programming",
        description: "Introduction to C programming.",
        price: 49.99,
        duration: 30,
        level: "Beginner",
        image: "uploads/c.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Java Fundamentals",
        description: "Comprehensive Java course.",
        price: 59.99,
        duration: 45,
        level: "Intermediate",
        image: "uploads/java.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "JavaScript Essentials",
        description: "Learn JavaScript from scratch.",
        price: 39.99,
        duration: 30,
        level: "Beginner",
        image: "uploads/javascript.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Kotlin for Android",
        description: "Develop Android apps with Kotlin.",
        price: 70.00,
        duration: 50,
        level: "Expert",
        image: "uploads/kotlin.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Python Programming",
        description: "Introduction to Python.",
        price: 50.00,
        duration: 40,
        level: "Beginner",
        image: "uploads/python.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Swift for iOS",
        description: "Build iOS apps using Swift.",
        price: 65.00,
        duration: 50,
        level: "Expert",
        image: "uploads/swift.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Advanced C++",
        description: "Deep dive into C++ programming.",
        price: 70.00,
        duration: 40,
        level: "Expert",
        image: "uploads/cpp.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Ruby on Rails",
        description: "Comprehensive Ruby on Rails course.",
        price: 65.00,
        duration: 45,
        level: "Intermediate",
        image: "uploads/ruby.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Data Structures",
        description: "Essential data structures for software development.",
        price: 60.00,
        duration: 35,
        level: "Intermediate",
        image: "uploads/data-structures.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Algorithms",
        description: "Algorithmic techniques and principles.",
        price: 75.00,
        duration: 50,
        level: "Expert",
        image: "uploads/algorithms.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "HTML & CSS",
        description: "Web development from scratch.",
        price: 30.00,
        duration: 25,
        level: "Beginner",
        image: "uploads/html-css.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "React Development",
        description: "Building applications with React.",
        price: 80.00,
        duration: 50,
        level: "Intermediate",
        image: "uploads/react.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Node.js",
        description: "Server-side development with Node.js.",
        price: 90.00,
        duration: 60,
        level: "Expert",
        image: "uploads/nodejs.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Angular Fundamentals",
        description: "Mastering Angular for front-end development.",
        price: 85.00,
        duration: 45,
        level: "Intermediate",
        image: "uploads/angular.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Full-stack JavaScript",
        description: "Learn full-stack development with JavaScript.",
        price: 95.00,
        duration: 70,
        level: "All levels",
        image: "uploads/fullstack-js.webp",
        instructors: "John Doe, Jane Smith",
      },
      {
        name: "Cloud Computing Basics",
        description: "Introduction to cloud computing.",
        price: 50.00,
        duration: 30,
        level: "Beginner",
        image: "uploads/cloud-computing.webp",
        instructors: "John Doe, Jane Smith",
      }
    ];

    for (const data of coursesData) {
      const exists = await courseRepository.findOneBy({ name: data.name });
      
      if (!exists) {
        const course = courseRepository.create({
          ...data,
          author: author,
        });

        await courseRepository.save(course);
      }
    }
    
    console.log(`Seeded ${coursesData.length} courses.`);
  }
}