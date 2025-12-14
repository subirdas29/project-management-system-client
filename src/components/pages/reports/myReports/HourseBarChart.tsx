export default function HoursBarChart({
  estimated,
  logged,
}: {
  estimated: number;
  logged: number;
}) {
  const max = Math.max(estimated, logged, 1);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Hours Overview</h3>

      {/* ESTIMATED */}
      <div>
        <p className="text-xs mb-1">Estimated</p>
        <div className="h-3 bg-muted rounded">
          <div
            className="h-3 bg-blue-500 rounded"
            style={{ width: `${(estimated / max) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {estimated} hrs
        </p>
      </div>

      {/* LOGGED */}
      <div>
        <p className="text-xs mb-1">Logged</p>
        <div className="h-3 bg-muted rounded">
          <div
            className={`h-3 rounded ${
              logged > estimated ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${(logged / max) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {logged} hrs
        </p>
      </div>
    </div>
  );
}
