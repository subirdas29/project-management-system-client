export default function TimeBreakdownTable({
  rows,
  title,
}: {
  title: string;
  rows: { label: string; hours: number }[];
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="font-medium mb-3">{title}</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground text-left">
            <th className="py-1">Period</th>
            <th className="py-1 text-right">Hours</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t">
              <td className="py-2">{r.label}</td>
              <td className="py-2 text-right font-medium">
                {r.hours} h
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
