This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

TO DO:
easy:
[X] Add auth with firebase
[X] Add Wrapper so that you can only add pixel if logged in
[X] add small square next to input to show colour
[X] Fix styling of input

hard:
[X] Add hover feature on pixel to see who placed it and when
[X] Understand database truly
    - 1 to 1 relationship, one pixel has one user only
[X] interaction when someone else presses on the pixel.
    - does the pixel go away from the first person who pressed it?
[] filter input with zod so you can only do valid colours
[] Add coverpage for new users. 
    - perhaps what the grid looks like rn + sign in with google to place a pixel + current pixel count/current pixel count out of whole grid e.g. 89/360
[] add a timeout so you cant spam 10 seconds

