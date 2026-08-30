import { ManageSubscriptionButton } from "./manage-subscription-button";

type Props = {
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
};

export function SubscriptionStatus({
  status,
  cancelAtPeriodEnd,
  currentPeriodEnd,
}: Props) {
  const formattedDate = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  if (cancelAtPeriodEnd) {
    return (
      <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8">
        <p className="text-sm font-semibold text-amber-300">
          Cancellation scheduled
        </p>

        <h2 className="mt-2 text-2xl font-bold">Premium remains active</h2>

        {formattedDate && (
          <p className="mt-2 text-muted-foreground">
            {"You'll keep Premium until"}
            {formattedDate}.
          </p>
        )}

        <ManageSubscriptionButton />
      </div>
    );
  }

  if (status === "past_due") {
    return (
      <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8">
        <p className="text-sm font-semibold text-amber-300">Payment issue</p>

        <h2 className="mt-2 text-2xl font-bold">Update your billing details</h2>

        <p className="mt-2 text-muted-foreground">
          Your latest payment could not be completed.
        </p>

        <ManageSubscriptionButton />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/5 p-8">
      <p className="text-sm font-semibold text-cyan-300">Premium active</p>

      <h2 className="mt-2 text-2xl font-bold">
        {"You're getting the full AquaAI experience."}
      </h2>

      {formattedDate && (
        <p className="mt-2 text-muted-foreground">
          Current period ends {formattedDate}.
        </p>
      )}

      <ManageSubscriptionButton />
    </div>
  );
}



