type Props = {
  status: string;
};

export function BillingAlert({
  status,
}: Props) {
  if (status === "past_due") {
    return (
      <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
        <p className="font-semibold">
          Payment needs attention
        </p>

        <p className="mt-1 text-amber-200/80">
          Your latest payment could not be completed.
          Please update your payment method to keep
          Premium active.
        </p>
      </div>
    );
  }

  return null;
}