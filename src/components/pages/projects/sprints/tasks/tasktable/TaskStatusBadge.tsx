const COLORS: Record<string, string> = {
  todo: 'bg-gray-200 text-gray-800',
  inprogress: 'bg-blue-200 text-blue-800',
  review: 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
};

export default function TaskStatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs capitalize ${COLORS[status]}`}
    >
      {status}
    </span>
  );
}
