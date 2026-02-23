"use client";
import { useEffect, useState } from "react";

const Select = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [selected, setSelected] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);

  const allOptions = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1,
    label: `Option ${i + 1}`,
  }));

  const filteredOptions = allOptions.filter((option) =>
    option.label.toLowerCase().includes(inputVal.toLowerCase()),
  );

  const visibleOptions = filteredOptions.slice(0, visibleCount);

  const handleScroll = (e) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom) {
      setVisibleCount((prev) => prev + 20);
    }
  };

  useEffect(() => {
    setVisibleCount(20);
  }, [inputVal, isOpen]);
  return (
    <div className="flex flex-col justify-center my-10">
      <input
        type="text"
        placeholder="Select..."
        className="border-2 text-center rounded-xl h-10 mx-auto w-50"
        value={inputVal}
        onChange={(e) => {
          setInputVal(e.target.value);
        }}
        onFocus={() => setIsOpen(true)}
      />
      <button
        className="border-2 rounded-xl text-zinc-300 bg-black h-10 w-30 mx-auto cursor-pointer border-black my-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close" : "Open"}
      </button>
      <div className="flex flex-wrap justify-center my-2 w-60 mx-auto">
        {selected.map((item) => (
          <div
            key={item.value}
            className="bg-black text-white rounded-full px-3 py-1 m-1 flex items-center "
          >
            {item.label}
            <button
              onClick={() =>
                setSelected(selected.filter((s) => s.value !== item.value))
              }
              className="ml-2 font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {isOpen ? (
        <div
          className="flex justify-center max-h-70 w-60 mx-auto overflow-y-auto border border-black rounded-xl"
          onScroll={handleScroll}
        >
          <div>
            {visibleOptions.map((option) => (
              <div key={option.value}>
                <button
                  onClick={() => {
                    if (!selected.some((s) => s.value === option.value)) {
                      setSelected([...selected, option]);
                    }
                  }}
                  className="border-2 rounded-xl text-zinc-300 bg-black h-10 w-30 mx-auto cursor-pointer border-black my-2"
                >
                  {option.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Select;
