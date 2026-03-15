import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Find users whose last_active_date is before yesterday (streak may be broken)
  const { data: users, error } = await supabase
    .from('users')
    .select('id, current_streak, longest_streak, last_active_date, streak_freezes_remaining')
    .lt('last_active_date', yesterday)
    .gt('current_streak', 0);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let processed = 0;

  for (const user of users || []) {
    if (user.streak_freezes_remaining > 0) {
      // Use a freeze token
      await supabase
        .from('users')
        .update({
          streak_freezes_remaining: user.streak_freezes_remaining - 1,
          last_active_date: yesterday, // Treat as if they were active
        })
        .eq('id', user.id);
    } else {
      // Break the streak
      await supabase
        .from('users')
        .update({ current_streak: 0 })
        .eq('id', user.id);
    }
    processed++;
  }

  return new Response(
    JSON.stringify({ processed, date: today }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
