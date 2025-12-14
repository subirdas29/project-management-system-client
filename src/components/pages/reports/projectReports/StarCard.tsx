export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border p-4 bg-background">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}
