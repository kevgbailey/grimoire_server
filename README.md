# README.md

# Express Web Server

This project is a simple Express web server built with TypeScript. It serves as a starting point for building web applications using Express.

## Project Structure

```
express-web-server
├── src
│   ├── app.ts
│   ├── controllers
│   │   └── index.ts
│   ├── middleware
│   │   └── index.ts
│   ├── routes
│   │   └── index.ts
│   └── types
│       └── index.ts
├── tests
│   └── app.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd express-web-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Database Stuff**
   ```
   npx prisma db push #apply schema to DB
   npx prisma generate #regenerate client
   ```

5. **Run the application:**
   ```bash
   npm start
   ```

## Usage

Visit `http://localhost:3000` in your browser to see the application in action.

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

## License

This project is licensed under the MIT License.
