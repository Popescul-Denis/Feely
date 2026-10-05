'use client'
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { JournalPageData } from "@utils/data-types/user-data";

export const EditJournalForm = () => {
  const params = useParams();
  const journalPageId = params?.id?.toString() || "";

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

  const [selectedColor, setSelectedColor] = useState<string>("#7f6042");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/log-in");
    }
  }, [router, status]);

  useEffect(() => {
    const fetchJournalPage = async () => {
      try {
        const res = await fetch(`/api/journal/journal-page/${journalPageId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.error || "Eroare la preluarea paginii jurnalului");
        } else {
          const journalPageData = await res.json();
          setjournalpageData(journalPageData.journalPage);
        }
      } catch (error) {
        console.error("Error fetching journal page", error);
        setError("Eroare la preluarea paginii jurnalului");
      }
    };

    if (journalPageId) {
      fetchJournalPage();
    }
  }, [journalPageId]);

  const updateJournalPage = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/journal/journal-page/${journalPageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ journalpageData }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Eroare la actualizarea paginii jurnalului");
      } else {
        const updatedJournalPageData = await res.json();
        setjournalpageData(updatedJournalPageData.journalPage);
        setSuccess("Pagina jurnalului a fost actualizata cu succes");
      }
    } catch (error) {
      console.error("Error updating journal page", error);
      setError("Eroare la actualizarea paginii jurnalului");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center p-4 gap-4">
      <h1 className="text-6xl" >
        Editare pagina jurnal
      </h1>
      {success && <p className="text-green-600 font-bold">{success}</p>}
      {error && <p className="text-red-600 font-bold">{error}</p>}
      <div className="flex w-full flex-row gap-20 mt-10">
        {/* Input de data  la inceput sa fie la journalpageData.date, dupa editare sa se schimbe*/}
        <div className="flex w-full max-w-xs flex-col gap-1">
          <label htmlFor="date" className="font-bold">
            Editeaza data paginii de jurnal
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
            Editeaza emotia zilei
          </label>
          <select
            id="emotion"
            name="emotion"
            value={journalpageData.feeling}
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
            Editeaza titlul paginii de jurnal
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
            value={journalpageData.title}
            className="w-full rounded-lg border border-[#d4c5a9] bg-[#fcfaf8] px-3 py-2 text-[#7f6042] outline-none transition-colors focus:border-[#7f6042] focus:ring-2 focus:ring-[#b48f64]/30 "
            disabled={loading}
          />
        </div>
      </div>
      <div className="w-full flex flex-row gap-10 mt-10">
        {/* Textarea pentru intregul continut al paginii de jurnal */}

        <div className="flex w-full  flex-col gap-1 max-w-1/2">
          <label htmlFor="content" className="font-bold">
            Editeaza continutul paginii de jurnal
          </label>
          <textarea
            id="content"
            name="content"
            rows={25}
            placeholder="Nu uita sa spui si cum te-ai simtit pe parcursul zilei. Sentimentele tale conteaza!"
            spellCheck={false}
            value={journalpageData.textPiece.text}
            onChange={(e) =>
              setjournalpageData({
                ...journalpageData,
                textPiece: { text: e.target.value, color: selectedColor },
              })
            }
            className="w-full rounded-lg border border-[#d4c5a9] bg-[#fcfaf8] px-3 py-2 outline-none transition-colors focus:border-[#7f6042] focus:ring-2 focus:ring-[#b48f64]/30"
            style={{ color: journalpageData.textPiece.color }}
          />
        </div>

        <div className="flex max-w-3/5 p-4 flex-col gap-4">
          <div className="flex flex-row">
            <div>
              <h1 className="font-bold">Editeaza culoarea de astazi</h1>
              <p className="text-xs">*Culoare selectata</p>
            </div>
            <input
              type="color"
              value={journalpageData.textPiece.color}
              onChange={(e) => {
                setSelectedColor(e.target.value); 
                setjournalpageData({
                  ...journalpageData,
                  textPiece: { ...journalpageData.textPiece, color: e.target.value },
                })
              }}
              className="ml-4 h-7 w-7 rounded-full cursor-pointer border-2 border-transparent hover:border-gray-300 transition-colors"
              style={{ backgroundColor: journalpageData.textPiece.color }}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row gap-6">
        <div className="w-full flex flex-col max-w-3xl">
          <label>Editeaza dorintele tale</label>
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
            value={journalpageData.userHope}
            className="w-full rounded-lg border border-[#d4c5a9] bg-[#fcfaf8] px-3 py-2 text-[#7f6042] outline-none transition-colors focus:border-[#7f6042] focus:ring-2 focus:ring-[#b48f64]/30 "
          />
        </div>
        <button
          type="submit"
          className="bg-green-400 border border-green-700 p-3 rounded-2xl font-bold cursor-pointer hover:bg-green-200 h-4/5 self-end text-white"
          disabled={loading}
          onClick={updateJournalPage}
        >
          {loading ? "Se actualizeaza..." : "Actualizeaza pagina in jurnal"}
        </button>
      </div>
    </div>
  );
};
