export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>Progress</span>
        <span>{percent}%</span>
      </div>

      <div className="h-2 w-full rounded bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
