import { TREATMENT_H2 } from "@/app/components/treatment-page/treatment-styles";
import type { TreatmentBlock } from "@/app/lib/treatment-pages";

export function TreatmentComparisonTable({ block }: { block: TreatmentBlock }) {
  const columns = block.columns ?? [];
  const rows = block.rows ?? [];
  if (columns.length < 2 || rows.length < 1) {
    console.warn("[treatment-page] skipped treatmentComparisonTable: incomplete table");
    return null;
  }
  const mismatch = rows.some((row) => (row.cells?.length ?? 0) !== columns.length);
  if (mismatch) {
    console.warn("[treatment-page] skipped treatmentComparisonTable: row length");
    return null;
  }

  const caption = block.caption?.trim() || "";
  const captionId = caption ? `${block._key || "comparison"}-caption` : undefined;

  return (
    <div>
      {caption ? (
        <h2 id={captionId} className={TREATMENT_H2}>
          {caption}
        </h2>
      ) : null}
      <div
        className={`${caption ? "mt-8" : ""} max-w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm ring-1 ring-slate-200/60`}
      >
        <table
          className="w-full table-fixed border-collapse text-left text-sm leading-snug md:text-[15px]"
          aria-labelledby={captionId}
        >
          <thead>
            <tr className="bg-slate-900 text-white">
              {columns.map((column, index) => {
                const heading = column.heading?.trim() || "";
                return (
                  <th
                    key={column._key || `column-${index}`}
                    scope="col"
                    className="px-3 py-3 font-semibold md:px-5 md:py-4"
                  >
                    {heading || <span className="sr-only">Category</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row._key || `row-${rowIndex}`}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                {(row.cells ?? []).map((cell, cellIndex) => {
                  const text = cell.text ?? "";
                  const className =
                    "px-3 py-3 align-top whitespace-pre-line md:px-5 md:py-4";
                  if (cellIndex === 0) {
                    return (
                      <th
                        key={cell._key || `cell-${cellIndex}`}
                        scope="row"
                        className={`${className} font-semibold text-slate-900`}
                      >
                        {text}
                      </th>
                    );
                  }
                  return (
                    <td
                      key={cell._key || `cell-${cellIndex}`}
                      className={`${className} text-slate-700`}
                    >
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
