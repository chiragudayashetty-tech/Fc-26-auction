import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rcobumyplrtoozbknnjb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjb2J1bXlwbHJ0b296YmtubmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDA2ODUsImV4cCI6MjA5ODY3NjY4NX0.WsjfFUEHjpDhC-eOfIZIQcJyQ9OyLfI2K6NZQqz-qX0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
