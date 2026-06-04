-- Run this in the Supabase SQL Editor to create the users table
-- This matches the Prisma schema and the API synchronization logic.

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  name TEXT,
  xp INTEGER,
  level INTEGER,
  streak INTEGER,
  target_calories INTEGER,
  base_expenditure INTEGER,
  target_protein INTEGER,
  target_carbs INTEGER,
  target_water INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
