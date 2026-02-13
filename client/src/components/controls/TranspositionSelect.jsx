export default function TranspositionSelect({ value, onChange, intervals }) {
  return (
    <div>
      <label>
        <b>Select Key of Transposition:{" "}</b>
        <select
          className="amethysta-regular"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
        {intervals.map((interval) => (
            <option key={interval} value={interval}>
                {interval}
            </option>
         ))}
        </select>
      </label>
    </div>
  );
}