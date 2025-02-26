import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export function GridPage() {
  const [birthdate, setBirthdate] = useState<string>("");
  const [age, setAge] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate age based on birthdate
  useEffect(() => {
    if (birthdate) {
      try {
        const birthDate = new Date(birthdate);
        const today = new Date();

        // Check if birthdate is valid and not in the future
        if (isNaN(birthDate.getTime())) {
          setError("Please enter a valid date");
          setAge(null);
          return;
        }

        if (birthDate > today) {
          setError("Birthdate cannot be in the future");
          setAge(null);
          return;
        }

        // Calculate age
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          calculatedAge--;
        }

        if (calculatedAge > 90) {
          calculatedAge = 90; // Cap at 90 years for our grid
        }

        setAge(calculatedAge);
        setError(null);
        // eslint-disable-next-line
      } catch (err) {
        setError("Error calculating age");
        setAge(null);
      }
    } else {
      setAge(null);
      setError(null);
    }
  }, [birthdate]);

  // Generate the grid of 90 years (9 rows of 10)
  const renderGrid = () => {
    const grid = [];
    const totalYears = 90;
    const yearsPerRow = 10;

    for (let row = 0; row < totalYears / yearsPerRow; row++) {
      const rowSquares = [];

      for (let col = 0; col < yearsPerRow; col++) {
        const yearIndex = row * yearsPerRow + col;
        const isFilled = age !== null && yearIndex < age;

        rowSquares.push(
          <div
            key={yearIndex}
            className={`flex h-6 w-6 items-center justify-center rounded-md border border-gray-700 transition-all duration-300 ease-in-out sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 ${isFilled ? "bg-fuchsia-600" : "bg-gray-800 hover:bg-gray-700"} `}
            title={`Year ${yearIndex + 1}`}
          >
            <span className="text-[0.5rem] text-gray-300 sm:text-xs md:text-sm">
              {yearIndex + 1}
            </span>
          </div>,
        );
      }

      grid.push(
        <div key={row} className="mb-1 flex gap-1 sm:mb-2 sm:gap-2">
          {rowSquares}
        </div>,
      );
    }

    return grid;
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-900 px-2 py-6 text-gray-100 sm:px-4 sm:py-12">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <h1 className="mb-4 text-center text-2xl font-bold text-fuchsia-400 sm:mb-8 sm:text-3xl md:text-4xl">
          Life Grid
        </h1>

        <div className="mb-4 rounded-lg bg-gray-800 p-3 shadow-lg sm:mb-8 sm:p-6">
          <div className="mb-3 flex flex-col items-center gap-2 sm:mb-6 sm:flex-row sm:gap-4">
            <div className="relative w-full flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
              </div>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2 pl-8 text-sm text-white focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:p-2.5 sm:pl-10 sm:text-base"
                placeholder="Select your birthdate"
              />
            </div>
            <button
              onClick={() => setBirthdate("")}
              className="w-full rounded-lg bg-gray-700 px-4 py-2 text-sm transition-colors hover:bg-gray-600 sm:w-auto sm:text-base"
            >
              Clear
            </button>
          </div>

          {error ? (
            <div className="mb-2 text-center text-sm text-red-400 sm:mb-4 sm:text-base">
              {error}
            </div>
          ) : null}

          {age !== null ? (
            <div className="mb-2 text-center sm:mb-4">
              <p className="text-base sm:text-xl">
                {"You've lived "}
                <span className="font-bold text-fuchsia-400">{age}</span> years
                {age < 90 ? (
                  <>
                    {" "}
                    with{" "}
                    <span className="font-bold text-green-400">
                      {90 - age}
                    </span>{" "}
                    years ahead
                  </>
                ) : null}
              </p>
            </div>
          ) : null}
        </div>

        <div className="overflow-x-auto rounded-lg bg-gray-800 p-3 shadow-lg sm:p-6">
          <div className="flex min-w-fit flex-col items-center">
            <div className="grid-container space-y-1 sm:space-y-2">
              {renderGrid()}
            </div>

            <div className="mt-4 flex flex-col items-center gap-2 sm:mt-6 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-fuchsia-600 sm:h-4 sm:w-4"></div>
                <span className="text-xs sm:text-sm">Years lived</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border border-gray-700 bg-gray-800 sm:h-4 sm:w-4"></div>
                <span className="text-xs sm:text-sm">Years ahead</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500 sm:mt-8 sm:text-sm">
          <p>
            This visualization represents a 90-year lifespan with each square
            representing one year.
          </p>
        </div>
      </div>
    </div>
  );
}
