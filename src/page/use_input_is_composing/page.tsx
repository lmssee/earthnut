import { useInputIsComposing } from 'customHooks';
import React, { useEffect, useRef } from 'react';

export default function UseInputIsComposing() {
  const inputRef = useRef<HTMLInputElement>(null);
  const isOver = useInputIsComposing(inputRef);

  function change(e: React.KeyboardEvent<HTMLInputElement>) {
    console.log(e);
  }

  useEffect(() => {
    return () => {};
  }, [isOver]);

  return (
    <div>
      <div>
        <form>
          <div className="text-3xl text-teal-300 w-full bg-slate-500 rounded-xl shadow-sm shadow-teal-900  md:w-32 lg:w-48 p-4">
            <input type="text" ref={inputRef} className="p-4" onKeyDown={change} />
          </div>
          <div className="p-4">
            <input type="text" required className="p-2" />
          </div>
          <button></button>
        </form>
      </div>
    </div>
  );
}
