"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Imperial_Script } from "next/font/google";
import {
  JournalPageData,
  JournalContentData,
} from "@utils/data-types/user-data";
import { monthNames } from "@utils/data-types/user-data";

const imperial = Imperial_Script({ subsets: ["latin"], weight: "400" });

export const JournalWritingPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [journalpageData, setjournalpageData] = useState<JournalPageData>({
    id: "",
    date: new Date(),
    feeling: "",
    title: "",
    textPiece: { text: "", color: "" },
    userHope: "",
    highlight: false,
  });
  const [highlightMode, setHighlightMode] = useState(false);

  const [selectedColor, setSelectedColor] = useState<string>("#7f6042");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k") {
        console.log("Journal Page Data:", journalpageData);
        console.log("Culoare selectata: ", selectedColor);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [journalpageData]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/log-in");
    }
  }, [router, status]);

  const createJournalPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const response = fetch("/api/journal/journal-page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ journalpageData }),
    });

    response
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.error || "Eroare la crearea paginii jurnalului");
        } else {
          const journalPageData = await res.json();
          setSuccess("Pagina jurnalului a fost creată cu succes!");
        }
      })
      .catch((error) => {
        console.error("Error creating journal page", error);
        setError("Eroare la crearea paginii jurnalului");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col w-full justify-center items-center p-4 gap-4">
      <h1 className="text-6xl" style={imperial.style}>
        Draga, {session?.user.name}
      </h1>
      {success && <p className="text-green-600 font-bold">{success}</p>}
      {error && <p className="text-red-600 font-bold">{error}</p>}
      <div className="flex w-full flex-row gap-20 mt-10">
        {/* Input de data */}
        <div className="flex w-full max-w-xs flex-col gap-1">
          <label htmlFor="date" className="font-bold">
            Data
          </label>
          <input
            type="date"
            id="date"
            name="date"
            onChange={(e) =>
              setjournalpageData({
                ...journalpageData,
                date: new Date(e.target.value),
              })
            }
            className="w-full rounded-lg border border-[#d4c5a9] bg-[#fcfaf8] px-3 py-2 text-[#7f6042] outline-none transition-colors focus:border-[#7f6042] focus:ring-2 focus:ring-[#b48f64]/30"
            disabled={loading}
          />
        </div>
        {/* Input de selectat emotia zilei */}
        <div className="flex w-full max-w-xs flex-col gap-1">
          <label htmlFor="emotion" className="font-bold">
            Cum te simti astazi ?
          </label>
          <select
            id="emotion"
            name="emotion"
            onChange={(e) =>
              setjournalpageData({
                ...journalpageData,
                feeling: e.target.value as string,
              })
            }
            className="w-full rounded-lg border border-[#d4c5a9] bg-[#fcfaf8] px-3 py-2 text-[#7f6042] outline-none transition-colors focus:border-[#7f6042] focus:ring-2 focus:ring-[#b48f64]/30 "
            disabled={loading}
          >
            <option value="fericit">&#128513; Fericit</option>
            <option value="trist">&#128546; Trist</option>
            <option value="furios">&#128544; Furios</option>
            <option value="entuziasmat">&#128518; Entuziasmat</option>
            <option value="anxios">&#128543; Anxios</option>
            <option value="plictisit">&#128529; Plictisit</option>
            <option value="obosit">&#128533; Obosit</option>
            <option value="recunoscator">&#128524; Recunoscator</option>
            <option value="singur">&#128549; Singur</option>
            <option value="relaxat">&#128527; Relaxat</option>
          </select>
        </div>
        {/* Input titlu (rezuma-ti intr-o propozitie) */}
        <div className="flex w-full min-w-0 flex-col gap-1">
          <label htmlFor="resume" className="font-bold">
            Rezuma-ti ziua intr-o propozitie
          </label>
          <input
            type="text"
            id="resume"
            name="resume"
            maxLength={50}
            spellCheck={false}
            placeholder="Maximum 50 de caractere"
            onChange={(e) =>
              setjournalpageData({ ...journalpageData, title: e.target.value })
            }
            className="w-full rounded-lg border border-[#d4c5a9] bg-[#fcfaf8] px-3 py-2 text-[#7f6042] outline-none transition-colors focus:border-[#7f6042] focus:ring-2 focus:ring-[#b48f64]/30 "
            disabled={loading}
          />
        </div>
      </div>
      <div className="w-full flex flex-row gap-10 mt-10">
        {/* Textarea pentru intregul continut al paginii de jurnal */}

        <div className="flex w-full  flex-col gap-1 max-w-1/2">
          <label htmlFor="content" className="font-bold">
            Spune-mi in detaliu ce ai facut azi!
          </label>
          <textarea
            id="content"
            name="content"
            disabled={highlightMode}
            rows={25}
            placeholder="Nu uita sa spui si cum te-ai simtit pe parcursul zilei. Sentimentele tale conteaza!"
            spellCheck={false}
            onChange={(e) =>
              setjournalpageData({
                ...journalpageData,
                textPiece: { text: e.target.value, color: selectedColor },
              })
            }
            className="w-full rounded-lg border border-[#d4c5a9] bg-[#fcfaf8] px-3 py-2 outline-none transition-colors focus:border-[#7f6042] focus:ring-2 focus:ring-[#b48f64]/30"
            style={{ color: selectedColor }}
          />
        </div>

        <div className="flex max-w-3/5 p-4 flex-col gap-4">
          <div>
            <div className="flex flex-row">
              <h1 className="font-bold">Highlight Mode</h1>
              <button
                type="button"
                role="switch"
                aria-checked={highlightMode}
                aria-label="Activeaza sau dezactiveaza Highlight Mode"
                onClick={() => {
                  const nextHighlightMode = !highlightMode;
                  setHighlightMode(nextHighlightMode);
                }}
                className={`relative ml-4 h-6 w-11 cursor-pointer rounded-full transition-colors ${highlightMode ? "bg-[#7f6042]" : "bg-gray-400"}`}
              >
                <span
                  className={`absolute left-0 top-1 h-4 w-4 rounded-full bg-white transition-transform ${highlightMode ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
            <div>
              <p className="text-xs">
                *Marcheaza din text toate emotiile, sentimentele, trairile si
                momentele-cheie pentru a ne ajuta la analiza starii tale
                emotionale.
              </p>
            </div>
          </div>
          <div className="flex flex-row">
            <div>
              <h1 className="font-bold">Selecteaza culoarea de astazi</h1>
              <p className="text-xs">*Culoare selectata</p>
            </div>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="ml-4 h-7 w-7 rounded-full cursor-pointer border-2 border-transparent hover:border-gray-300 transition-colors"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row gap-6">
        <div className="w-full flex flex-col max-w-3xl">
          <label>Ce iti propui de la ziua de maine?</label>
          <input
            type="text"
            id="userHope"
            name="userHope"
            maxLength={50}
            spellCheck={false}
            placeholder="Maximum 60 de caractere"
            onChange={(e) =>
              setjournalpageData({
                ...journalpageData,
                userHope: e.target.value,
              })
            }
            className="w-full rounded-lg border border-[#d4c5a9] bg-[#fcfaf8] px-3 py-2 text-[#7f6042] outline-none transition-colors focus:border-[#7f6042] focus:ring-2 focus:ring-[#b48f64]/30 "
          />
        </div>
        <button
          type="submit"
          className="bg-green-400 border border-green-700 p-3 rounded-2xl font-bold cursor-pointer hover:bg-green-200 h-4/5 self-end text-white"
          disabled={loading}
          onClick={createJournalPage}
        >
          {loading ? "Se adauga..." : "Adauga pagina in jurnal"}
        </button>
        <button
          className="bg-transparent border-3 border-gray-400 p-3 rounded-2xl font-bold cursor-pointer hover:opacity-70 h-4/5 self-end text-gray-600"
          onClick={() => {
            setPreview((p) => !p);
          }}
        >
          {preview ? "Inchide previzualizarea" : "Previzualizeaza"}
        </button>
      </div>
      {preview && 
      <div>
        <JournalPagePreview journalpageData={journalpageData}/>
      </div>}
    </div>
  );
};

type JournalPagePreviewType = {
  journalpageData: JournalPageData;
};

const JournalPagePreview = ({ journalpageData }: JournalPagePreviewType) => {
  return (
    <div className="w-125 h-170 bg-white rounded-xl border border-[#dcd3c6] shadow-[inset_0_0_30px_rgba(0,0,0,0.03),0_15px_30px_rgba(0,0,0,0.1)] p-5 flex flex-col font-sans text-[10px] text-gray-600">
      {/* Bara de sus cu luni */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-1 mb-1">
        <div className="flex gap-2 font-bold text-[#8b6d4e]">
          <span>
            {journalpageData
              ? monthNames[new Date(journalpageData.date).getMonth()]
              : ""}
          </span>
        </div>
        <div className="cursor-pointer">☰</div>
      </div>

      {/* Rândul cu zilele */}
      <div className="flex gap-1 text-[8px] text-gray-400 mb-3">
        {Array.from({ length: 31 }, (_, i) => (
          <span
            key={i}
            className={`w-3.5 text-center ${
              journalpageData &&
              i + 1 === new Date(journalpageData.date).getDate()
                ? "relative z-10 scale-180 font-bold text-[#d4af37]"
                : ""
            }`}
          >
            {i + 1}
          </span>
        ))}
      </div>

      {/* Conținutul principal pe coloana */}
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Sentimentul utilizatorului : "Astazi ma simt ...!" */}

        <div className=" flex gap-2">
          <p className="font-bold text-[14px] text-gray-400 ">
            Astazi ma simt {journalpageData.feeling}!
          </p>
        </div>

        {/* Titlul paginii de jurnal */}

        <div className=" flex  gap-2">
          <div className="w-full h-6 bg-[#f5e4c5] rounded-lg border border-[#d4c5a9] flex items-center justify-center">
            <span className="text-[17px] text-[#7f6042] font-bold">
              {journalpageData.title}
            </span>
          </div>
        </div>

        {/* Continutul paginii de jurnal */}
        <div className="flex min-h-0 flex-1 gap-2">
          <div className="min-h-0 w-full overflow-y-auto rounded-lg border border-[#d4c5a9] bg-[#f5e4c5] p-2">
            <p
              className="text-[15px] text-[#7f6042] font-semibold bg-clip-content"
              style={{
                whiteSpace: "pre-wrap",
                color: journalpageData.textPiece.color,
                wordWrap: "break-word",
              }}
            >
              {journalpageData.textPiece.text}
            </p>
          </div>
        </div>

        {/* Speranta utilizatorului de maine : "Sper ca maine sa ..." */}

        <div className="flex gap-2">
          <div className="w-full h-6 bg-[#f5e4c5] rounded-lg border border-[#d4c5a9] flex items-center justify-center">
            <span className="text-[12px] text-[#7f6042] font-bold">
              {journalpageData.userHope}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
