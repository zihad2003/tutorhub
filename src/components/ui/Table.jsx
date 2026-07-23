import { C } from "../../constants/tokens";

export function Table({ columns, data, emptyMessage = "No data available" }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: C.border }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase"
                style={{ color: C.textSecondary }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm" style={{ color: C.textSecondary }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b transition-colors duration-150 hover:bg-gray-50" style={{ borderColor: C.border }}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm" style={{ color: C.text }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
