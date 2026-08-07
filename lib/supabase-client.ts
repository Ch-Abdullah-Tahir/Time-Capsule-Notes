import {createClient} from "@supabase/supabase-js";
import { create } from "domain";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;//! for not getting warnings
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
