"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Config from "../configuration/config";

interface Option {
  value: number;
  label: string;
}

const Select = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [selected, setSelected] = useState<Option[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [chips, setChips] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [clearable, setClearable] = useState(false);
  const [nonMultipleSelection, setNonMultipleSelection] = useState("");

  const optionsRef = useRef<HTMLDivElement | null>(null);

  const allOptions = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1,
    label: `Option ${i + 1}`,
  }));

  const filteredOptions = allOptions.filter((option) =>
    option.label.toLowerCase().includes(inputVal.toLowerCase()),
  );

  const visibleOptions = filteredOptions.slice(0, visibleCount);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom) setVisibleCount((prev) => prev + 20);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setVisibleCount(20);
  }, [inputVal, isOpen]);

  useEffect(() => {
    console.log(
      "chips:",
      chips,
      "multiple:",
      multiple,
      "clearable:",
      clearable,
      "nonMultiple:",
      nonMultipleSelection,
    );
  }, [chips, multiple, clearable, nonMultipleSelection]);

  const handleSelect = (option: Option) => {
    if (multiple) {
      if (!selected.some((s: Option) => s.value === option.value)) {
        setSelected([...selected, option]);
      }
      setInputVal("");
    } else {
      setNonMultipleSelection(option.label);
      setInputVal("");
      setIsOpen(false);
    }
  };

  const autoComplete = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    const match = allOptions.find(
      (option) => option.label.toLowerCase() === val.toLowerCase(),
    );

    if (match) {
      if (multiple) {
        setTimeout(() => {
          if (!selected.some((s: Option) => s.value === match.value)) {
            setSelected([...selected, match]);
          }
          setInputVal("");
        }, 1000);
      } else {
        setTimeout(() => {
          setNonMultipleSelection(match.label);
          setIsOpen(false);
          setInputVal("");
        }, 1000);
      }
    }
  };

  const inputDisplayValue = chips
    ? inputVal
    : multiple
      ? inputVal || selected.map((o: Option) => o.label).join(", ")
      : inputVal || nonMultipleSelection;

  return (
    <div
      ref={optionsRef}
      className="flex flex-col justify-center my-10 w-max mx-auto"
    >
      <div className="mx-auto relative w-60">
        <input
          type="text"
          placeholder="Select..."
          className="border-2 text-start pl-3 rounded-xl h-10 w-full pr-10 py-2"
          value={inputDisplayValue}
          onChange={(e) => autoComplete(e)}
          onFocus={() => setIsOpen(true)}
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isOpen ? (
            <Image
              src="/select-input-down.png"
              width={20}
              height={20}
              alt="selectClick"
            />
          ) : (
            <Image
              src="/select-input-up.png"
              width={20}
              height={20}
              alt="selectClick"
              className="cursor-pointer"
            />
          )}
        </span>
      </div>

      <div className="flex flex-wrap justify-center w-60 mx-auto">
        {chips
          ? multiple
            ? selected.map((item: Option) => (
                <div
                  key={item.value}
                  className="bg-black text-white rounded-full px-3 py-1 m-1 flex items-center"
                >
                  {item.label}
                  {clearable && (
                    <button
                      onClick={() =>
                        setSelected(
                          selected.filter(
                            (s: Option) => s.value !== item.value,
                          ),
                        )
                      }
                      className="ml-2 font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            : nonMultipleSelection && (
                <div className="bg-black text-white rounded-full px-3 py-1 m-1 flex items-center">
                  {nonMultipleSelection}
                  {clearable && (
                    <button
                      onClick={() => setNonMultipleSelection("")}
                      className="ml-2 font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              )
          : multiple
            ? selected.map((item: Option) => (
                <div key={item.value} className="ml-2">
                  {item.label}
                  {clearable && (
                    <button
                      onClick={() =>
                        setSelected(
                          selected.filter(
                            (s: Option) => s.value !== item.value,
                          ),
                        )
                      }
                      className="font-bold cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            : nonMultipleSelection && (
                <div>
                  {nonMultipleSelection}
                  {clearable && (
                    <button
                      onClick={() => setNonMultipleSelection("")}
                      className="font-bold cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
      </div>

      {isOpen && (
        <div
          className="flex justify-center max-h-70 w-max mx-auto overflow-y-auto border border-black rounded-xl"
          onScroll={handleScroll}
        >
          <div>
            {visibleOptions.map((option) => (
              <div key={option.value}>
                <div
                  onClick={() => handleSelect(option)}
                  className="border text-black bg-zinc-300 h-10 w-60 mx-auto cursor-pointer border-zinc-400"
                >
                  <div className="flex justify-center my-1.5">
                    {option.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Config
        setChips={setChips}
        setMultiple={setMultiple}
        setClearable={setClearable}
      />
    </div>
  );
};

export default Select;
