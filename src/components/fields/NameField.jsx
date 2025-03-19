export default function NameField({ value, onChange, required = false }) {
  return (
    <div className="form-field">
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={value || ""}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
