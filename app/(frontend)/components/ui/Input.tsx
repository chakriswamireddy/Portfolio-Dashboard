type InputProps = {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
    type?: string;
  };
  
  export function Input({ label, value, onChange, type = "text" }: InputProps) {
    return (
      <div>
        <label className="block mb-1 text-xs text-zinc-400">
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    );
  }
  