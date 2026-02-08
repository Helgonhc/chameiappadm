import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { Profile } from '../types';
export type { Profile } from '../types';
export * from '../types';

export interface ProfileExtended extends Profile {
  // Adicione campos extras aqui se necessário, 
  // mas por enquanto Profile em types está completo
}
