type SelectProps = {
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
  };
  
 export function Select({ label, value, options, onChange }: SelectProps) {
    return (
      <div>
        <label className="block mb-1 text-xs text-zinc-400">
          {label}
        </label>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }
  