import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../entities/userEntity';
import * as bcrypt from 'bcrypt';

const roles = ['student', 'teacher'];

export default setSeederFactory(User, async (faker) => {
    const user = new User();
    
    user.first_name = faker.person.firstName();
    user.last_name = faker.person.lastName();
    user.email = faker.internet.email({ firstName: user.first_name, lastName: user.last_name });
    user.password = await bcrypt.hash('password123', 10);
    user.role = roles[Math.floor(Math.random() * roles.length)];
    user.avatar_url = faker.image.avatar();

    return user;
});