"use client";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export const Search = ({ placeholder, onSubmit }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-[300px]">
      <div className="flex items-center border border-black/50 rounded-lg overflow-hidden">
        <div className="px-3 py-2 flex items-center justify-center">
          <AiOutlineSearch />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="
            flex-1 px-3 py-2 outline-none 
            focus:ring-0 focus:border-none 
            focus:ring-transparent focus:outline-none
            [&:invalid]:ring-0 [&:invalid]:outline-none [&:invalid]:border-none
          "
        />
      </div>
    </form>
  );
};

export const SearchDefault = ({ placeholder, onSubmit }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-[300px]">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <div className="px-3 py-2 flex items-center justify-center">
          <AiOutlineSearch />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 outline-none focus:ring-0 focus:border-none"
        />
      </div>
    </form>
  );
};
