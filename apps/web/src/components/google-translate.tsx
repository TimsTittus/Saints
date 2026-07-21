"use client";

import { useEffect, useState } from "react";
import { Button } from "@Saints/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@Saints/ui/components/dropdown-menu";
import { Languages, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
            layout?: number;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const LANGUAGES = [
  { code: "en", label: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ml", label: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
] as const;

export function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Read stored language preference or googtrans cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const googTransCookie = getCookie("googtrans");
    if (googTransCookie) {
      if (googTransCookie.includes("/ml")) {
        setCurrentLang("ml");
      } else {
        setCurrentLang("en");
      }
    } else {
      const stored = localStorage.getItem("preferred_lang");
      if (stored) {
        setCurrentLang(stored);
      }
    }

    // Initialize Google Translate script
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ml",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    if (langCode === currentLang) return;

    const hostname = window.location.hostname;
    const cookiePath = langCode === "en" ? "/en/en" : `/en/${langCode}`;

    // Set cookie for path and domain
    document.cookie = `googtrans=${cookiePath}; path=/; domain=${hostname}`;
    document.cookie = `googtrans=${cookiePath}; path=/;`;

    localStorage.setItem("preferred_lang", langCode);
    setCurrentLang(langCode);

    // Try dispatching event to Google Translate combo box if present
    const selectEl = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement | null;

    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
    } else {
      // Reload if script container isn't hydrated yet
      window.location.reload();
    }

    if (langCode === "ml") {
      toast.success("ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി (Changed to Malayalam)", {
        description: "Google Translate is now rendering content in Malayalam.",
      });
    } else {
      toast.success("Switched language to English", {
        description: "Restored original English content.",
      });
    }
  };

  const toggleLanguage = () => {
    const nextLang = currentLang === "en" ? "ml" : "en";
    changeLanguage(nextLang);
  };

  if (!isMounted) return null;

  return (
    <div className="relative flex items-center gap-1.5">
      {/* Hidden container for Google Translate Widget */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      {/* Quick Switch Button (EN <-> ML) */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="h-9 px-3 gap-1.5 text-xs font-semibold rounded-lg bg-amber-50/50 hover:bg-amber-100/60 dark:bg-amber-950/30 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 border-amber-200/80 dark:border-amber-800/60 transition-all duration-200 shadow-xs"
        title={`Switch to ${currentLang === "en" ? "Malayalam (മലയാളം)" : "English"}`}
      >
        <Languages className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="uppercase tracking-wider">
          {currentLang === "en" ? "EN" : "ML"}
        </span>
        <span className="hidden sm:inline-block font-normal text-[11px] opacity-85">
          ({currentLang === "en" ? "English" : "മലയാളം"})
        </span>
      </Button>

      {/* Dropdown Menu for Detailed Language Options */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Translation Options"
            />
          }
        >
          <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="sr-only">Translation Options</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 p-1.5">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-slate-500 dark:text-slate-400 font-normal px-2 py-1">
              Google Translate Support
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          {LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center justify-between px-2.5 py-2 text-sm rounded-md cursor-pointer ${isSelected
                  ? "bg-amber-100/70 text-amber-900 font-medium dark:bg-amber-900/40 dark:text-amber-100"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span>{lang.label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {lang.nativeName}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}