---
partial_id: "001"
artifact: WCA
class_name: rd_common (utility module)
header_file: apis/rivwebcapi/rivwebcapi/rd_common.h
source_file: apis/rivwebcapi/rivwebcapi/rd_common.c
phase: 2
status: done
agent_version: 1.1.0
---

# rd_common (Utility Module)

## Typ
Pure C utility module (brak klas/Qt). Dostarcza funkcje konwersji i walidacji uzywane przez wszystkie funkcje API.

## Odpowiedzialnosc (WHAT)
Zestaw funkcji pomocniczych do konwersji dat i czasu (ISO 8601 datetime string <-> struct tm, time string <-> milisekundy), parsowania wartosci boolowskich ze stringow, bezpiecznego kopiowania stringow (strlcpy) oraz pobierania offsetu UTC lokalnej strefy czasowej. Stanowi wspolny fundament dla calej biblioteki.

## Makra kompatybilnosci
| Makro | Wartosc | Cel |
|-------|---------|-----|
| _MYRIVLIB_INIT_DECL | `extern "C" {` (C++) / pusty (C) | Kompatybilnosc C++ (extern "C" linkage) |
| _MYRIVLIB_FINI_DECL | `}` (C++) / pusty (C) | Zamkniecie bloku extern "C" |
| RIVC_DEBUG_OUT | (komentarz) | Wlacz/wylacz debug na stderr |

## Publiczne API
| Funkcja | Parametry | Efekt | Warunki |
|---------|-----------|-------|---------|
| RD_ReadBool | const char *val | Parsuje string "true"/"yes"/"on" (case-insensitive) -> 1, reszta -> 0 | - |
| RD_Cnv_DTString_to_tm | const char *datein | Konwertuje datetime string (ISO 8601 z timezone) na struct tm w czasie lokalnym | String 19-26 znakow; obsluguje Z (Zulu), +/- offset |
| RD_Cnv_tm_to_DTString | struct tm *tmptr, char *dest | Konwertuje struct tm na datetime string z offsetem UTC | tm musi byc valid (validate_tm); dest min 26 bajtow |
| strlcpy | char *dest, const char *src, size_t bufsize | Bezpieczne kopiowanie stringow z automatycznym null-termination | bufsize > 0 |
| get_local_offset | (void) | Zwraca offset UTC lokalnej strefy jako double (sekundy) | - |
| validate_tm | struct tm *tmptr | Waliduje strukture tm (rok 1900-9999, miesiace, dni, godziny, minuty, sekundy, leap year) | - |
| RD_Cnv_TString_to_msec | const char *str | Konwertuje time string "HH:MM:SS.Z" na milisekundy od polnocy | String min 10 znakow; HH 0-23, MM 0-59, SS 0-59 |
| RD_Cnv_msec_to_TString | char *str, size_t len, int msec | Konwertuje milisekundy od polnocy na time string "HH:MM:SS.Z" | msec >= 0 |

## Reguly biznesowe (z implementacji)
- Datetime parsing obsluguje 3 formaty timezone: Z (Zulu/UTC), +HH:MM, -HH:MM
- Nieprawidlowa dlugosc stringa (< 19 lub > 26 znakow) zwraca zerowa strukture tm
- Walidacja tm: rok musi byc 1900-9999, obsługuje leap year (400/100/4 rule)
- Time string: precision do 1/10 sekundy (nie milisekund mimo nazwy funkcji -- 100ms granularnosc)
- Windows compatibility: DST adjustment, _WIN32 guards, MINGW32 macro aliases

## Linux-specific uzycia
Brak bezposrednich odwolan do komponentow Linux-specific. Kompatybilnosc cross-platform (Windows/Linux).

## Zaleznosci
- time.h, stdio.h, stdlib.h, string.h, math.h (standardowe C)
