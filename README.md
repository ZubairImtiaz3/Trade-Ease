<div align="center">
<h1>Trade Ease - Invoicing and Sales Analytics App</h1>

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

A full-stack app built with NextJs, TypeScript, Shadcn UI, and Supabase. It allows users to generate and manage invoices in PDF format, track all related data, and view detailed sales analytics through a dynamic dashboard.

## Features <a name="features"></a>

<li>
🔐 Secure sign-in and user management to keep each user's data safe.
</li>
<li>
🧾 Easily create and manage invoices for sold items.
</li>
<li>
📄 Download invoices in a PDF template.
</li>
<li>
📊 Keep track of all invoice data with comprehensive records.
</li>
<li>
📈 Get an overview of sales with a dynamic dashboard.
</li>
<li>
🗓️ Customize your dashboard view with daily, weekly, monthly, or all-time preference option.
</li>

## Technologies <a name="technologies"></a>
- `Next.Js`
- `TypeScript`
- `Supabase`
- `Shadcn UI`
- `Tailwind CSS`
- `InvoiceTemplateJsPdf` 

## Images <a name="images"></a>

### Dashboard <a name="dashboard"></a>

<img width="400" alt="dashboard" src="public/popup.png">

### Create Invoice <a name="create invoice"></a>

<img width="800" alt="popup" src="public/table.png">


## Demo

You can view a fully working demo at [trade-ease.vercel.app](https://trade-ease.vercel.app/).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app -e with-supabase
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd name-of-new-app
   ```

4. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The app should now be running on [localhost:3000](http://localhost:3000/).
