import {
  isValid,
  isAfter,
  differenceInYears,
  differenceInMonths,
  differenceInWeeks,
} from "date-fns";
import { Info } from "lucide-react";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

import { LocalStorageUtil } from "../utils/LocalStorageUtil";

import { Tooltip, Button, RadioGroup, Radio } from "./components";

type ViewMode = "years" | "months" | "weeks";
interface Annotation {
  index: number;
  text: string;
  position?: { x: number; y: number };
  color?: string;
}

interface StatisticItem {
  week: number;
  text: string;
  color?: string;
  name: string;
  age: number;
}

const famousDeaths: StatisticItem[] = [
  {
    week: 27 * 52 + 17,
    text: "Kurt Cobain - Died April 5, 1994 at age 27",
    color: "#6A0DAD",
    name: "Kurt Cobain",
    age: 27,
  },
  {
    week: 27 * 52 + 29,
    text: "Jim Morrison - Died July 3, 1971 at age 27",
    color: "#4169E1",
    name: "Jim Morrison",
    age: 27,
  },
  {
    week: 27 * 52 + 39,
    text: "Janis Joplin - Died October 4, 1970 at age 27",
    color: "#1E90FF",
    name: "Janis Joplin",
    age: 27,
  },
  {
    week: 27 * 52 + 44,
    text: "Jimi Hendrix - Died September 18, 1970 at age 27",
    color: "#00BFFF",
    name: "Jimi Hendrix",
    age: 27,
  },
  {
    week: 27 * 52 + 48,
    text: "Amy Winehouse - Died July 23, 2011 at age 27",
    color: "#32CD32",
    name: "Amy Winehouse",
    age: 27,
  },
  {
    week: 36 * 52 + 5,
    text: "Marilyn Monroe - Died August 5, 1962 at age 36",
    color: "#FF00FF",
    name: "Marilyn Monroe",
    age: 36,
  },
  {
    week: 35 * 52 + 14,
    text: "Mozart - Died December 5, 1791 at age 35",
    color: "#FFA500",
    name: "Mozart",
    age: 35,
  },
  {
    week: 39 * 52 + 10,
    text: "Martin Luther King Jr. - Died April 4, 1968 at age 39",
    color: "#008000",
    name: "Martin Luther King Jr.",
    age: 39,
  },
  {
    week: 40 * 52 + 8,
    text: "John Lennon - Died December 8, 1980 at age 40",
    color: "#FF1493",
    name: "John Lennon",
    age: 40,
  },
  {
    week: 42 * 52 + 29,
    text: "Elvis Presley - Died August 16, 1977 at age 42",
    color: "#008080",
    name: "Elvis Presley",
    age: 42,
  },
  {
    week: 46 * 52 + 30,
    text: "JFK - Died November 22, 1963 at age 46",
    color: "#FF0000",
    name: "JFK",
    age: 46,
  },
  {
    week: 50 * 52 + 18,
    text: "Michael Jackson - Died June 25, 2009 at age 50",
    color: "#0000FF",
    name: "Michael Jackson",
    age: 50,
  },
  {
    week: 54 * 52 + 9,
    text: "Steve Jobs - Died October 5, 2011 at age 56",
    color: "#000080",
    name: "Steve Jobs",
    age: 56,
  },
  {
    week: 53 * 52 + 39,
    text: "Jim Henson - Died May 16, 1990 at age 53",
    color: "#228B22",
    name: "Jim Henson",
    age: 53,
  },
  {
    week: 36 * 52 + 35,
    text: "Princess Diana - Died August 31, 1997 at age 36",
    color: "#FFB6C1",
    name: "Princess Diana",
    age: 36,
  },
  {
    week: 56 * 52 + 10,
    text: "Abraham Lincoln - Died April 15, 1865 at age 56",
    color: "#800080",
    name: "Abraham Lincoln",
    age: 56,
  },
];

const lateBloomingEntrepreneurs: StatisticItem[] = [
  {
    week: 40 * 52,
    text: "Vera Wang - Started her fashion design career at age 40",
    color: "#FF69B4",
    name: "Vera Wang",
    age: 40,
  },
  {
    week: 52 * 52,
    text: "Ray Kroc - Started McDonald's at age 52",
    color: "#FFD700",
    name: "Ray Kroc",
    age: 52,
  },
  {
    week: 40 * 52,
    text: "Colonel Sanders - Opened Sanders Court & Café at age 40",
    color: "#FF4500",
    name: "Colonel Sanders",
    age: 40,
  },
  {
    week: 55 * 52,
    text: "Arianna Huffington - Founded The Huffington Post at age 55",
    color: "#9370DB",
    name: "Arianna Huffington",
    age: 55,
  },
  {
    week: 40 * 52,
    text: "Lynda Weinman - Founded Lynda.com at age 40",
    color: "#20B2AA",
    name: "Lynda Weinman",
    age: 40,
  },
  {
    week: 43 * 52,
    text: "Samuel L. Jackson - First major film role at age 43",
    color: "#8A2BE2",
    name: "Samuel L. Jackson",
    age: 43,
  },
  {
    week: 62 * 52,
    text: "Colonel Sanders - Started franchising Kentucky Fried Chicken at age 62",
    color: "#FF6347",
    name: "Colonel Sanders (KFC)",
    age: 62,
  },
  {
    week: 49 * 52,
    text: "Julia Child - Published first cookbook at age 49",
    color: "#00CED1",
    name: "Julia Child",
    age: 49,
  },
  {
    week: 30 * 52,
    text: "Jeff Bezos - Founded Amazon at age 30",
    color: "#32CD32",
    name: "Jeff Bezos",
    age: 30,
  },
  {
    week: 40 * 52,
    text: "Gary Heavin - Founded Curves at age 40",
    color: "#BA55D3",
    name: "Gary Heavin",
    age: 40,
  },
  {
    week: 57 * 52,
    text: "Wally Blume - Founded Denali Flavors at age 57",
    color: "#1E90FF",
    name: "Wally Blume",
    age: 57,
  },
  {
    week: 48 * 52,
    text: "Momofuku Ando - Invented instant ramen at age 48",
    color: "#FF8C00",
    name: "Momofuku Ando",
    age: 48,
  },
  {
    week: 50 * 52,
    text: "Charles Darwin - Published 'On the Origin of Species' at age 50",
    color: "#2E8B57",
    name: "Charles Darwin",
    age: 50,
  },
  {
    week: 55 * 52,
    text: "Takichiro Mori - Became a real estate investor at age 55",
    color: "#4682B4",
    name: "Takichiro Mori",
    age: 55,
  },
  {
    week: 51 * 52,
    text: "Tim and Nina Zagat - Published first Zagat guide at age 51",
    color: "#9932CC",
    name: "Tim and Nina Zagat",
    age: 51,
  },
];

export const loader = () => null;

export function GridPage() {
  const bdFromStorage = LocalStorageUtil.get("birthdate");
  const [birthdate, setBirthdate] = useState<string>(bdFromStorage);
  const [age, setAge] = useState<number | null>(null);
  const [ageInMonths, setAgeInMonths] = useState<number | null>(null);
  const [ageInWeeks, setAgeInWeeks] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("weeks");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showFamousDeaths, setShowFamousDeaths] = useState(true);
  const [showEntrepreneurs, setShowEntrepreneurs] = useState(false);
  const [datasetType, setDatasetType] = useState<string>("deaths");

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    console.log("CLOG ~ GridPage ~ birthdate:", birthdate);
    const bd = new Date(birthdate);
    if (bd) {
      try {
        const today = new Date();

        if (!isValid(bd)) {
          setError("Please enter a valid date");
          setAge(null);
          setAgeInMonths(null);
          setAgeInWeeks(null);
          return;
        }

        if (isAfter(bd, today)) {
          setError("Birthdate cannot be in the future");
          setAge(null);
          setAgeInMonths(null);
          setAgeInWeeks(null);
          return;
        }

        let calculatedAge = differenceInYears(today, bd);
        let calculatedMonths = differenceInMonths(today, bd);
        let calculatedWeeks = differenceInWeeks(today, bd);

        if (calculatedAge > 90) calculatedAge = 90;
        if (calculatedMonths > 1080) calculatedMonths = 1080;
        if (calculatedWeeks > 4680) calculatedWeeks = 4680;

        setAge(calculatedAge);
        setAgeInMonths(calculatedMonths);
        setAgeInWeeks(calculatedWeeks);
        setError(null);
      } catch {
        setError("Error calculating age");
        setAge(null);
        setAgeInMonths(null);
        setAgeInWeeks(null);
      }
    } else {
      setAge(null);
      setAgeInMonths(null);
      setAgeInWeeks(null);
      setError(null);
    }
  }, [birthdate]);

  useEffect(() => {
    if (viewMode === "weeks") {
      if (datasetType === "deaths" && showFamousDeaths) {
        const deathAnnotations = famousDeaths.map((death) => ({
          index: death.week,
          text: death.text,
          color: death.color,
        }));
        setAnnotations(deathAnnotations);
      } else if (datasetType === "entrepreneurs" && showEntrepreneurs) {
        const entrepreneurAnnotations = lateBloomingEntrepreneurs.map(
          (entrepreneur) => ({
            index: entrepreneur.week,
            text: entrepreneur.text,
            color: entrepreneur.color,
          }),
        );
        setAnnotations(entrepreneurAnnotations);
      } else {
        setAnnotations([]);
      }
    } else {
      setAnnotations([]);
    }
  }, [viewMode, showFamousDeaths, showEntrepreneurs, datasetType]);

  const handleDateChange = useCallback((date: string) => {
    setBirthdate(date);
  }, []);

  const handleClear = useCallback(() => {
    setBirthdate("");
    setAnnotations([]);
  }, []);

  const handleNativeDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) {
        LocalStorageUtil.set("birthdate", value);
        console.log("CLOG ~ handleDateChange ~ date:", value);
        handleDateChange(value);
      } else {
        handleClear();
      }
    },
    [handleDateChange, handleClear],
  );

  const getBoxSizeClasses = useCallback(() => {
    switch (viewMode) {
      case "months":
        return "w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 xl:w-5 xl:h-5";
      case "weeks":
        return "w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4";
      case "years":
      default:
        return "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14";
    }
  }, [viewMode]);

  const getFontSizeClass = useCallback(() => {
    switch (viewMode) {
      case "months":
      case "weeks":
        return "hidden";
      case "years":
      default:
        return "text-[0.5rem] sm:text-xs md:text-sm";
    }
  }, [viewMode]);

  const getGapClass = useCallback(() => {
    switch (viewMode) {
      case "months":
        return "gap-0.5 sm:gap-1 mb-0.5 sm:mb-1";
      case "weeks":
        return "gap-0.5 mb-0.5";
      case "years":
      default:
        return "gap-1 sm:gap-2 mb-1 sm:mb-2";
    }
  }, [viewMode]);

  const renderGrid = useMemo(() => {
    const grid = [];
    let totalUnits: number;
    let unitsPerRow: number;
    // let unitLabel: string;
    let currentProgress: number | null;

    switch (viewMode) {
      case "months":
        totalUnits = 1080;
        unitsPerRow = 36;
        // unitLabel = "month";
        currentProgress = ageInMonths;
        break;
      case "weeks":
        totalUnits = 4680;
        unitsPerRow = 52;
        // unitLabel = "week";
        currentProgress = ageInWeeks ? Math.min(ageInWeeks, totalUnits) : null;
        break;
      case "years":
      default:
        totalUnits = 90;
        unitsPerRow = 10;
        // unitLabel = "year";
        currentProgress = age;
        break;
    }

    const rows = Math.ceil(totalUnits / unitsPerRow);
    const boxSizeClasses = getBoxSizeClasses();
    const fontSizeClass = getFontSizeClass();

    if (
      viewMode === "weeks" &&
      ((datasetType === "deaths" && showFamousDeaths) ||
        (datasetType === "entrepreneurs" && showEntrepreneurs))
    ) {
      grid.push(
        <div key="week-of-year-label" className="mb-2 flex items-center">
          <div className="w-8"></div>
          <div className="flex-grow text-center text-sm font-medium text-blue-400">
            Week of the Year
            <span className="ml-1 inline-block rotate-0 transform">→</span>
          </div>
        </div>,
      );
    }

    for (let row = 0; row < rows; row++) {
      const rowSquares = [];

      if (
        viewMode === "weeks" &&
        ((datasetType === "deaths" && showFamousDeaths) ||
          (datasetType === "entrepreneurs" && showEntrepreneurs))
      ) {
        const age = row;
        if (age % 5 === 0) {
          rowSquares.push(
            <div
              key={`age-label-${row}`}
              className="flex h-full w-8 items-center justify-end pr-2"
            >
              <span className="text-[0.6rem] text-gray-400">{age}</span>
            </div>,
          );
        } else {
          rowSquares.push(<div key={`age-label-${row}`} className="w-8"></div>);
        }
      }

      for (let col = 0; col < unitsPerRow; col++) {
        const unitIndex = row * unitsPerRow + col;
        if (unitIndex >= totalUnits) break;

        const isFilled =
          currentProgress !== null && unitIndex < currentProgress;
        const hasAnnotation = annotations.some((a) => a.index === unitIndex);

        let tooltipContent = null;
        if (hasAnnotation) {
          const dataset =
            datasetType === "deaths" ? famousDeaths : lateBloomingEntrepreneurs;
          const item = dataset.find((d) => d.week === unitIndex);
          if (item) {
            tooltipContent = (
              <div className="p-2">
                <div className="flex items-start">
                  <div
                    className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: item.color }}
                  >
                    <span className="text-sm font-bold text-white">
                      {item.age}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {`${item.name} - (Age ${item.age})`}
                    </p>
                    <p className="mt-1 text-sm text-gray-300">{item.text}</p>
                  </div>
                </div>
              </div>
            );
          }
        }

        const boxElement = (
          <div
            key={unitIndex}
            ref={(el) => {
              if (el) boxRefs.current.set(unitIndex, el);
              else boxRefs.current.delete(unitIndex);
            }}
            className={`relative ${boxSizeClasses} border border-gray-700 ${viewMode === "years" ? "rounded-sm" : ""} flex items-center justify-center transition-all duration-300 ease-in-out ${isFilled ? "bg-fuchsia-600" : "bg-gray-800 hover:bg-gray-700"} ${hasAnnotation ? (viewMode === "years" ? "ring-1" : "ring-[0.5px]") + " ring-yellow-400" : ""} cursor-pointer`}
          >
            {viewMode === "years" ? (
              <span className={`${fontSizeClass} text-gray-300`}>
                {unitIndex + 1}
              </span>
            ) : null}
          </div>
        );

        if (hasAnnotation && tooltipContent) {
          rowSquares.push(
            <Tooltip
              key={unitIndex}
              content={tooltipContent}
              placement="top"
              showArrow={true}
              trigger="hover"
            >
              {boxElement}
            </Tooltip>,
          );
        } else {
          rowSquares.push(boxElement);
        }
      }

      grid.push(
        <div key={row} className={`flex ${getGapClass()}`}>
          {rowSquares}
        </div>,
      );
    }

    if (
      viewMode === "weeks" &&
      ((datasetType === "deaths" && showFamousDeaths) ||
        (datasetType === "entrepreneurs" && showEntrepreneurs))
    ) {
      grid.unshift(
        <div
          key="age-vertical-label"
          className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 transform whitespace-nowrap text-sm font-medium text-blue-400"
        >
          Age
          <span className="ml-1 inline-block rotate-90 transform">↓</span>
        </div>,
      );
    }

    return grid;
  }, [
    viewMode,
    age,
    ageInMonths,
    ageInWeeks,
    annotations,
    datasetType,
    showFamousDeaths,
    showEntrepreneurs,
    getBoxSizeClasses,
    getFontSizeClass,
    getGapClass,
  ]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-900 px-2 py-6 text-gray-100 sm:px-4 sm:py-12">
      <div className="w-full max-w-7xl">
        <h1 className="mb-4 text-center text-2xl font-bold text-fuchsia-400 sm:mb-8 sm:text-3xl md:text-4xl">
          Life Grid
        </h1>

        <div className="flex flex-col items-center">
          <div className="mb-4 w-full max-w-3xl rounded-lg bg-gray-800 p-3 shadow-lg sm:mb-8 sm:p-6">
            <div className="mb-3 flex flex-col items-center gap-2 sm:mb-6 sm:flex-row sm:gap-4">
              <div className="relative w-full flex-grow">
                <div className="w-full pl-8 sm:pl-10">
                  <input
                    aria-label="Enter your birthdate"
                    type="date"
                    value={birthdate}
                    onChange={handleNativeDateChange}
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2 pl-8 text-sm text-white focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:p-2.5 sm:pl-10 sm:text-base"
                  />
                </div>
              </div>
              <Button
                color="gray"
                onClick={handleClear}
                className="w-full sm:w-auto"
              >
                Clear
              </Button>
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
                  <span className="font-bold text-fuchsia-400">
                    {viewMode === "years"
                      ? `${age} years`
                      : viewMode === "months"
                        ? `${ageInMonths} months`
                        : `${ageInWeeks} weeks`}
                  </span>
                  {viewMode === "years" && age < 90 ? (
                    <>
                      {" "}
                      with{" "}
                      <span className="font-bold text-green-400">
                        {90 - age} years
                      </span>{" "}
                      ahead
                    </>
                  ) : null}
                  {viewMode === "months"
                    ? ageInMonths &&
                      ageInMonths < 1080 && (
                        <>
                          {" "}
                          with{" "}
                          <span className="font-bold text-green-400">
                            {1080 - ageInMonths} months
                          </span>{" "}
                          ahead
                        </>
                      )
                    : null}
                  {viewMode === "weeks" && ageInWeeks && ageInWeeks < 4680 ? (
                    <>
                      {" "}
                      with{" "}
                      <span className="font-bold text-green-400">
                        {4680 - ageInWeeks} weeks
                      </span>{" "}
                      ahead
                    </>
                  ) : null}
                </p>
              </div>
            ) : null}

            <div className="mb-4 flex justify-center gap-2">
              <Button
                color={viewMode === "years" ? "primary" : "gray"}
                onClick={() => setViewMode("years")}
              >
                Years
              </Button>
              <Button
                color={viewMode === "months" ? "primary" : "gray"}
                onClick={() => setViewMode("months")}
              >
                Months
              </Button>
              <Button
                color={viewMode === "weeks" ? "primary" : "gray"}
                onClick={() => setViewMode("weeks")}
              >
                Weeks
              </Button>
            </div>

            {viewMode === "weeks" ? (
              <RadioGroup
                value={datasetType}
                onChange={(value: string) => {
                  setDatasetType(value);
                  if (value === "deaths") {
                    setShowFamousDeaths(true);
                    setShowEntrepreneurs(false);
                  } else {
                    setShowFamousDeaths(false);
                    setShowEntrepreneurs(true);
                  }
                }}
              >
                <Radio value="deaths">Famous Deaths</Radio>
                <Radio value="entrepreneurs">Late Bloomers</Radio>
              </RadioGroup>
            ) : null}
          </div>
        </div>

        <div className="relative w-full">
          <div className="flex flex-col items-center">
            <div
              ref={gridContainerRef}
              className="grid-container relative mx-auto max-w-full overflow-visible"
              style={{
                marginLeft:
                  viewMode === "weeks" &&
                  ((datasetType === "deaths" && showFamousDeaths) ||
                    (datasetType === "entrepreneurs" && showEntrepreneurs))
                    ? "2rem"
                    : "0",
                marginRight:
                  viewMode === "weeks" &&
                  ((datasetType === "deaths" && showFamousDeaths) ||
                    (datasetType === "entrepreneurs" && showEntrepreneurs))
                    ? "0"
                    : "0",
                marginTop:
                  viewMode === "weeks" &&
                  ((datasetType === "deaths" && showFamousDeaths) ||
                    (datasetType === "entrepreneurs" && showEntrepreneurs))
                    ? "0"
                    : "0",
              }}
            >
              {renderGrid}
            </div>

            <div className="mt-4 flex flex-col items-center gap-2 sm:mt-6 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-fuchsia-600 sm:h-4 sm:w-4"></div>
                <span className="text-xs sm:text-sm">Time lived</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border border-gray-700 bg-gray-800 sm:h-4 sm:w-4"></div>
                <span className="text-xs sm:text-sm">Time ahead</span>
              </div>
              {viewMode !== "weeks" && (
                <div className="flex items-center gap-2">
                  <div className="flex h-3 w-3 items-center justify-center rounded border border-yellow-400 sm:h-4 sm:w-4">
                    <Info className="h-2 w-2 text-yellow-400" />
                  </div>
                  <span className="text-xs sm:text-sm">Annotation</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500 sm:mt-8 sm:text-sm">
          <p>
            This visualization represents life with each square representing one{" "}
            {viewMode === "years"
              ? "year"
              : viewMode === "months"
                ? "month"
                : "week"}
            .
          </p>
          {viewMode === "weeks"
            ? ((datasetType === "deaths" && showFamousDeaths) ||
                (datasetType === "entrepreneurs" && showEntrepreneurs)) && (
                <p className="mt-1">
                  {datasetType === "deaths"
                    ? "Hover over highlighted squares to see when famous people died."
                    : "Hover over highlighted squares to see when successful people started later in life."}
                </p>
              )
            : null}
          {viewMode !== "weeks" ? (
            <p className="mt-1">Click on any square to add an annotation.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
