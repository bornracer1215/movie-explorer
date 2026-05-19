"use client";

type Props = {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
  readOnly?: boolean;
};

export function RatingStars({ value, onChange, size = "md", readOnly }: Props) {
  const stars = [1, 2, 3, 4, 5];
  const cls = size === "sm" ? "text-base" : "text-2xl";
  return (
    <div className={`inline-flex gap-1 ${cls}`} role="radiogroup" aria-label="Rating">
      {stars.map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n === value ? 0 : n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-checked={filled}
            role="radio"
            className={`leading-none ${filled ? "text-yellow-400" : "text-neutral-400"} ${readOnly ? "cursor-default" : "hover:scale-110 transition"}`}
          >
            {filled ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
