import { getAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "./server";

export async function findSupabaseUserId(subscription: {
  metadata: Record<string, string>;
  customer: string | null;
}) {
  const metadataUserId = subscription.metadata?.supabase_user_id;

  if (metadataUserId) {
    return metadataUserId;
  }

  if (!subscription.customer) {
    return null;
  }

  const supabase = getAdminClient();

  const { data } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", subscription.customer)
    .maybeSingle();

  return data?.user_id ?? null;
}
