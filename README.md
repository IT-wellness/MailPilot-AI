# MailPilot AI

An AI-powered email assistant for Outlook that helps you write, read, and manage emails more efficiently.

## Features

- AI-powered email composition
- Smart reply suggestions
- Email summarization
- Translation support
- Tone adjustments
- Real-time suggestions

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (PostgreSQL)
- NextAuth.js
- React Icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/mailpilot?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `DATABASE_URL`: Your PostgreSQL database connection string
- `NEXTAUTH_URL`: The base URL of your application
- `NEXTAUTH_SECRET`: A secret key for NextAuth.js (generate with `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

## Development

- `npm run dev`: Start the development server
- `npm run build`: Build the application
- `npm start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
