interface ConfigProps {
  setChips: React.Dispatch<React.SetStateAction<boolean>>;
  setMultiple: React.Dispatch<React.SetStateAction<boolean>>;
  setClearable: React.Dispatch<React.SetStateAction<boolean>>;
}

const Config = ({ setChips, setMultiple, setClearable }: ConfigProps) => {
  return (
    <div className="flex flex-col justify-evenly border rounded-xl w-60 h-max mx-auto my-10">
      <p className="mx-auto my-5 text-2xl">Configuration</p>
      <div className="mx-auto my-5">
        <input
          type="checkbox"
          id="chips"
          className="cursor-pointer"
          onChange={(e) => setChips(e.target.checked)}
        />
        <label htmlFor="chips" className="ml-2">
          Chips
        </label>
      </div>

      <div className="mx-auto my-5">
        <input
          type="checkbox"
          id="multiple"
          className="cursor-pointer"
          onChange={(e) => setMultiple(e.target.checked)}
        />
        <label htmlFor="multiple" className="ml-2">
          Multiple
        </label>
      </div>

      <div className="mx-auto my-5">
        <input
          type="checkbox"
          id="clearable"
          className="cursor-pointer"
          onChange={(e) => setClearable(e.target.checked)}
        />
        <label htmlFor="clearable" className="ml-2">
          Clearable
        </label>
      </div>
    </div>
  );
};

export default Config;
