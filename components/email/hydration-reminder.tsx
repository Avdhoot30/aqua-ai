type Props = {
  name: string;
  amountMl: number;
  remainingMl: number;
  goalMl: number;
};

export function HydrationReminderEmail({
  name,
  amountMl,
  remainingMl,
  goalMl,
}: Props) {
  return (
    <div
      style={{
        fontFamily:
          "Arial, Helvetica, sans-serif",
        lineHeight: 1.6,
        color: "#0f172a",
      }}
    >
      <h1>AquaAI 💧</h1>

      <p>
        Hi {name || "there"},
      </p>

      <p>
        Time for a hydration check-in.
      </p>

      <p>
        A quick{" "}
        <strong>
          {amountMl} ml
        </strong>{" "}
        drink can help you stay on track.
      </p>

      <p>
        You have approximately{" "}
        <strong>
          {remainingMl} ml
        </strong>{" "}
        remaining toward your{" "}
        <strong>
          {goalMl} ml
        </strong>{" "}
        daily target.
      </p>

      <p>
        Keep going — every sip counts.
      </p>

      <hr />

      <p
        style={{
          color: "#64748b",
          fontSize: "12px",
        }}
      >
        AquaAI hydration reminder
      </p>
    </div>
  );
}