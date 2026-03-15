import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Find commands that haven't been used in 7+ days and are above "learned" tier
  const { data: decayed, error } = await supabase
    .from('command_mastery')
    .select('id, user_id, command_name, mastery_tier')
    .lt('last_used_at', sevenDaysAgo)
    .neq('mastery_tier', 'learned')
    .eq('decay_notified', false);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let decayedCount = 0;

  for (const entry of decayed || []) {
    // Drop mastery one tier: mastered → practiced, practiced → learned
    const newTier = entry.mastery_tier === 'mastered' ? 'practiced' : 'learned';

    await supabase
      .from('command_mastery')
      .update({ mastery_tier: newTier, decay_notified: true })
      .eq('id', entry.id);

    decayedCount++;
  }

  return new Response(
    JSON.stringify({ processed: decayedCount, timestamp: new Date().toISOString() }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
