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
  const inputContainerRef = useRef<HTMLDivElement | null>(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => { 
      if (inputContainerRef.current) {
        setDropdownWidth(inputContainerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [selected, inputVal, chips, nonMultipleSelection]);

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

  const handleSelect = (option: Option) => {
    const exists = selected.some((s: Option) => s.value === option.value);
    if (multiple) {
      if (exists) {
        setSelected(selected.filter((s) => s.value !== option.value));
      } else {
        setSelected([...selected, option]);
      }
      setInputVal("");
    } else {
      setNonMultipleSelection(option.label);
      setInputVal("");
      setIsOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const match = allOptions.find(
        (option) => option.label.toLowerCase() === inputVal.toLowerCase(),
      );
      if (!match) return;
      if (multiple) {
        if (!selected.some((s) => s.value === match.value)) {
          setSelected([...selected, match]);
        }
        setInputVal("");
      } else {
        setNonMultipleSelection(match.label);
        setIsOpen(false);
        setInputVal("");
      }
    }
  };

  return (
    <div
      ref={optionsRef}
      className="flex flex-col justify-center my-10 w-max mx-auto "
    >
      <div className="mx-auto relative w-max max-w-105 flex">
        <div
          className="border-2 rounded-xl min-h-10 w-full px-2 py-1 flex flex-wrap items-center gap-1"
          ref={inputContainerRef}
        >
          {chips ? (
            multiple ? (
              selected.map((item) => (
                <div
                  key={item.value}
                  className="bg-black text-white rounded-full px-3 py-1 text-sm flex items-center"
                >
                  {item.label}
                </div>
              ))
            ) : nonMultipleSelection ? (
              <div className="bg-black text-white rounded-full px-3 py-1 text-sm flex items-center">
                {nonMultipleSelection}
              </div>
            ) : null
          ) : multiple ? (
            selected.map((item) => <div key={item.value}>{item.label},</div>)
          ) : (
            <div>{nonMultipleSelection}</div>
          )}
          <input
            type="text"
            placeholder="Select..."
            className="flex-1 outline-none min-w-15"
            value={inputVal}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        <span
          className="flex absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image
            src={isOpen ? "/select-input-up.png" : "/select-input-down.png"}
            width={20}
            height={20}
            alt={isOpen ? "close" : "open"}
          />
        </span>

        {clearable &&
          (multiple ? selected.length > 0 : nonMultipleSelection) && (
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => {
                setSelected([]);
                setNonMultipleSelection("");
                setInputVal("");
              }}
            >
              <Image src="/closed.png" alt="clear" width={18} height={18} />
            </span>
          )}
      </div>

      {isOpen && (
        <div
          className="flex justify-center max-h-70 w-max mx-auto overflow-y-auto border border-black rounded-xl"
          onScroll={handleScroll}
        >
          <div style={{ width: dropdownWidth }}>
            {visibleOptions.map((option) => (
              <div key={option.value}>
                <div
                  onClick={() => handleSelect(option)}
                  className="border bg-zinc-300 h-10 mx-auto cursor-pointer border-zinc-400 flex items-center justify-between px-3"
                >
                  <label htmlFor={`option-${option.value}`}>
                    {option.label}
                  </label>
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={selected.some((s) => s.value === option.value)}
                      id={`option-${option.value}`}
                      readOnly
                    />
                  )}
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
