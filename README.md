# API_BACK_T_NSA

Steps to run this project:

## Only when you git clone the project
1. Run `yarn`
2. Run `yarn run typeorm migration:create -n CreateAdminUser `
3. File inside `src/migration` was created 
4. Replace `up` function by 
```
  public async up(queryRunner: QueryRunner): Promise<any> {
    const user = new User();
    user.username = 'admin';
    user.password = 'admin';
    user.hashPassword();
    user.role = 'ADMIN';
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }
```
5. Add inside the same file 
```
import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {User} from "../entity/User";
```

> [!TIP]
> Change the password :)

## Step for launch the api

1. Run `docker-compose build  && docker-compose up -d` command
2. Api will be available on  `localhost:3000`
3. Api logs will be avaible on  `http://localhost:3000/swagger-stats/ui`





