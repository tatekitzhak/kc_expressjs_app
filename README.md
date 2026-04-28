# Structure of a Project: TypeScript, Node.js, Express and MongoDB Web Application

``` bash
|Domain                 | Method       | URI                                  | Action  | Name  |
|-----------------------|:------------:| ------------------------------------:| -------:|------:|
| http://localhost:3000 |GET           | /                                    |         |       |
|                       |GET           | /api                                 |         |       |
|                       |GET           | /api/blods                           |         |       |
|                       |GET           |/api/blod/:id                         |         |       |
|                       |GET           |/category/subcategory/topics/article  |         |       |  
```

``` bash
├── build
├── src
│   ├── configsEnv
│   │   ├── mongoDB.ts
│   │   ├── redis.ts
│   │   └── NativeEvent.ts
│   ├── controllers
│   │   ├── Api
│   │   │   ├── Auth
│   │   │   │   ├── Login.ts
│   │   │   │   ├── RefreshToken.ts
│   │   │   │   └── Register.ts
│   │   │   └── Home.ts
│   │   └── index.ts
│   ├── database 
│   │   ├── Database.ts
│   │   └── NativeEvent.ts
│   ├── exception 
│   │   ├── Handler.ts
│   │   └── NativeEvent.ts
│   ├── interfaces
│   │   ├── models
│   │   │   └── Schema.ts
│   │   └── vendors
│   │        ├── index.ts
│   │        ├── INext.ts
│   │        ├── IRequest.ts
│   │        └── IResponse.ts
│   ├── middlewares
│   │   ├── CORS.ts
│   │   ├── Http.ts
│   │   ├── Kernel.ts
│   │   ├── Log.ts
│   │   └── View.ts
│   ├── models
│   │   └── User.ts
│   ├── providers
│   │   ├── App.ts
│   │   ├── Cache.ts
│   │   ├── Database.ts
│   │   ├── Express.ts
│   │   ├── Locals.ts
│   │   ├── Queue.ts
│   │   └── Routes.ts
│   ├── routes
│   │   ├── Api.ts
│   │   └── Web.ts
│   ├── services
│   │   └── strategies
│   │        ├── Google.ts
│   │        ├── Local.ts
│   │        └── Twitter.ts
│   └── index.ts
├── .dockerignore
├── .env
├── .eslintrc 
├── .gitignore 
├── Dockerfile
├── docker-compose.yml
├── nodemon.json
├── package.json
├── README.md
├── tsconfig.json
└── tslint.json
```

# Remove and clean dependencies
- `rm -rf package-lock.json node_modules`
- `rm -rf package-lock.json`
- `npm cache verify`
- `npm cache clean -f`
