"use client";
import { useState } from "react";

export default function Interactive() {
  let [counter, setCounter] = useState(0);

  return (
    <article className="w-2/3 text-pretty">
      <h3 className="text-2xl font-bold">This page is interactive!</h3>
      <br />
      <button
        className="p-2 border rounded-md "
        onClick={() => {
          setCounter((c) => c + 1);
        }}
      >
        <p>Count is {counter}</p>
      </button>
    </article>
  );
}
