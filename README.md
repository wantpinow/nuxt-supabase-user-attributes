# nuxt-supabase-user-attributes

<!-- [![Npm package version](https://badgen.net/npm/v/nuxt-editorjs)](https://npmjs.com/package/nuxt-editorjs)
[![Npm package total downloads](https://badgen.net/npm/dt/nuxt-editorjs)](https://npmjs.com/package/nuxt-editorjs)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) -->

Persistent user attributes with Supabase and Nuxt.

## Introduction

This module extends the `@nuxtjs/supabase` module to allow for user attribute tables (such as profiles and metadata) to be used in a Nuxt3 application with a similar interface to [useSupabaseUser()](https://supabase.nuxtjs.org/usage/composables#usesupabaseuser) via a single composable:

```javascript
<script setup>
  const {metadata, profile} = useSupabaseUserAttributes() // example usage: a
  metadata table with roles if(metadata.role != "admin") {navigateTo("/")}
</script>
```

## Setup and Installation

This module requires a Supabase database with one or more user attribute tables. Each of these tables must include a primary key named `id` which references the `auth.users.id` column. See `/supabase/migrations/0_users_profiles.sql` for an example of two such user attribute tables, complete with Postgres triggers and row level security policies. Once the database has been set up (and started if running locally), add a `SUPABASE_URL` and `SUPABASE_KEY` to a `.env` file. Next, follow the steps below:

- Install the Supabase module: `yarn add @nuxtjs/supabase`
- Install the use attributes module: `yarn add nuxt-supabase-user-attributes`
- Add both modules to your `nuxt.config.ts` file:

```javascript
export default defineNuxtConfig({
  ...
  modules: ["nuxt-supabase-user-attributes", "@nuxtjs/supabase"],
  supabaseUserAttributes: {
    tables: {
      table_name: "table_alias",
      ...
    },
  },
  ...
});
```

Here, `supabaseUserAttributes.tables` defines a set of table names and aliases. The table names must match the user attribute table names, whereas the table aliases are human-readable keys that are accessible via `useSupabaseUserAttributes()`. For example, we may define a `user_metadata` table to store private and immutable information about a user such as their role. The following configuration:

```javascript
supabaseUserAttributes: {
  tables: {
    user_metadata: "metadata";
  }
}
```

Allows for the current user's metadata to be accessed at any point in the application (both client and server-side) using the following composable:

```javascript
const { metadata } = useSupabaseUserAttributes();
```

## Development

We include a development playground with an example database schema able to be initialised locally with the Supabase CLI (`supabase start`). This example includes two example users (`user@test.com` and `admin@test.com` - both using the password `12345678`) with different roles and privileges as defined in `/supabase/migrations/0_users_profiles.sql`. Once the local database is running, use `yarn` to develop and build the module:

- Run `yarn` to install required dependencies.
- Run `yarn dev:prepare` to generate type stubs.
- Use `yarn dev` to start [playground](./playground) in development mode.
- Use `yarn prepack` to build the module.
