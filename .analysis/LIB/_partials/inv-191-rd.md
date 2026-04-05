---
partial_id: 191
artifact: LIB
class_name: rd.h (globals)
header_file: lib/rd.h
source_file: null
phase: 2
status: done
agent_version: 1.1.0
---

# rd.h — Globalne stałe i enumeracje

## Typ Qt
Header-only (stałe, #define, enums)

## Odpowiedzialność (WHAT)
Centralny plik definicji globalnych Rivendell — stałe systemowe, zakresy portów, rozmiary buforów, stałe protokołów, globalne enumeracje. Includowany przez praktycznie każdy plik w projekcie.

## Kluczowe stałe
- RD_MAX_CARDS (8) — max kart audio na stację
- RD_MAX_PORTS (8) — max portów na kartę
- RD_MAX_STREAMS (9) — max strumieni na kartę
- MAX_DECKS (24) — max decków nagrywania
- RD_RDXPORT_PORT (default 80) — port HTTP API
- RD_RIPCD_PORT (5006), RD_CAED_PORT (5005), RD_CATCHD_PORT (5007) — porty daemon'ów
- RDXPORT_COMMAND_* — kody komend HTTP API (~40 komend)
- Rozmiary buforów, timeouty, ścieżki systemowe

## Stany i kategorie (enums)
Brak osobnych enumów — stałe są #define

## Reguły biznesowe
- Zakresy portów i limitów definiują architekturę systemu
- Kody RDXPORT_COMMAND_* definiują pełne API web service

## Zależności
Brak (header-only, includowany wszędzie)
