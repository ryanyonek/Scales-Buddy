export default function NoteLabelsToggle({ value, onChange }) {
  return (
    // Toggle note labels
    <div style={{ marginBottom: "10px" }}>
    <label>
        <input
        className="amethysta-regular"
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        />
        <b>Show Note Labels</b>
    </label>
    </div>
  );
}
