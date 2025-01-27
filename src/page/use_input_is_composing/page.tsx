import { useInputIsComposing } from 'customHooks';
import React, { useEffect, useRef } from 'react';

export default function UseInputIsComposing() {
  const inputRef = useRef<HTMLInputElement>(null);
  const isOver = useInputIsComposing(inputRef);

  function change(e: React.KeyboardEvent<HTMLInputElement>) {
    console.log(e);
    console.log(isOver);
  }

  useEffect(() => {
    console.log(isOver);

    return () => {};
  }, [isOver]);

  return (
    <div>
      <div>
        <input type="text" ref={inputRef} onKeyDown={change} />
      </div>
    </div>
  );
}
