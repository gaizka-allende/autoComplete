import { ReactNode, useRef, useState, useEffect } from "react";
interface AutoCompleteProps {
  apiURL: string;
  onResultClick?: (result: string) => void;
}

const timer = (s: number) => new Promise((res) => setTimeout(res, s * 1000));

const apiResponse = [
  "Get started",
  "Installation",
  "Configuration",
  "Guides",
  "API Reference",
  "Examples",
  "FAQ",
  "Contributing",
  "License",
];

export function AutoComplete<T>(props: AutoCompleteProps) {
  const { apiURL, onResultClick } = props;
  const input = useRef<HTMLInputElement>(null);
  const loaderElem = useRef<HTMLDivElement>(null);
  const resultsElem = useRef<HTMLDivElement>(null);
  const [resultsElemContent, setResults] = useState<string | ReactNode | null>(
    null
  );

  return (
    <>
      <div className="flex items-center gap-3">
        <label htmlFor="input" id="label">
          <svg
            className="w-3 h-3 sr-only:hidden"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
          <span className="hidden sr-only:block">Search</span>
        </label>
        <input
          ref={input}
          className="input border border-gray-300 rounded-md w-64 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          aria-autocomplete="both"
          aria-labelledby="docsearch-label"
          id="docsearch-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          enterKeyHint="go"
          spellCheck="false"
          placeholder="Search the docs"
          maxLength={64}
          type="search"
          aria-activedescendant="search-item-0"
          aria-controls="docsearch-list"
          onKeyDown={(e) => {
            if (/^[a-zA-Z0-9]$/.test(e.key) || e.key === "Backspace") {
              let value = input.current?.value || "";
              if (e.key === "Backspace") {
                value = value.slice(0, -1);
              } else {
                value = `${value}${e.key}`;
              }
              if (value === "" || value.length < 3) {
                resultsElem.current?.classList.add("hidden");
              }
              return;
            }

            e.preventDefault();
          }}
          onChange={async (e) => {
            if (e.target.value === "" || e.target.value.length < 3) {
              e.preventDefault();
              return;
            }
            loaderElem.current?.classList.remove("hidden");

            const results = await new Promise<string[]>(async (resolve) => {
              console.log(apiURL);
              await timer(2);
              resolve(
                apiResponse.filter((result) =>
                  result.toLowerCase().includes(e.target.value.toLowerCase())
                )
              );
            });

            loaderElem.current?.classList.add("hidden");
            setResults(
              <ul>
                {results &&
                  Array.isArray(results) &&
                  results.map((result, index) => (
                    <li
                      key={`result-${result}-${index}`}
                      className={`${
                        onResultClick ? "cursor-pointer" : ""
                      } py-1 pr-1 font-mono font-medium text-xs leading-6 text-sky-500 whitespace-nowrap dark:text-sky-400 border-t border-slate-100 dark:border-slate-400/10`}
                      onClick={() => {
                        if (onResultClick) {
                          input.current!.value = result;
                          resultsElem.current?.classList.add("hidden");
                          onResultClick(result);
                        }
                      }}
                    >
                      <span>
                        {result.slice(
                          0,
                          result
                            .toUpperCase()
                            .indexOf(e.target.value.toUpperCase())
                        )}
                      </span>
                      <span className="bg-yellow-300">
                        {e.target.value.toLowerCase()}
                      </span>
                      <span>
                        {result.slice(
                          result
                            .toUpperCase()
                            .indexOf(e.target.value.toUpperCase()) +
                            e.target.value.length
                        )}
                      </span>
                    </li>
                  ))}
              </ul>
            );
            resultsElem.current?.classList.remove("hidden");
          }}
        ></input>
      </div>
      <div ref={loaderElem} className="ml-6 w-64 text-left hidden">
        <p className="py-1 pr-1 font-mono font-medium text-xs leading-6 text-sky-500 whitespace-nowrap dark:text-sky-400 border-t border-slate-100 dark:border-slate-400/10">
          {"Searching..."}
        </p>
      </div>
      <div ref={resultsElem} className="ml-6 w-64 text-left">
        {resultsElemContent}
      </div>
    </>
  );
}
