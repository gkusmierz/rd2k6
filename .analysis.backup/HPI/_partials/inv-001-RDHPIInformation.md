---
partial_id: "001"
artifact: HPI
class_name: RDHPIInformation
header_file: rdhpi/rdhpiinformation.h
source_file: rdhpi/rdhpiinformation.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDHPIInformation

## Typ Qt
Plain C++ (brak Q_OBJECT, brak dziedziczenia z QObject)

## Odpowiedzialnosc (WHAT)
Kontener danych przechowujacy informacje identyfikacyjne i wersjonujace adaptera AudioScience HPI. Przechowuje numer seryjny, wersje HPI SDK (major/minor/point zakodowane w uint32_t), wersje DSP, wersje PCB i numer montazu. Umozliwia odczyt i zapis tych danych oraz ich resetowanie do wartosci domyslnych.

## Sygnaly
Brak -- klasa nie dziedziczy z QObject.

## Sloty
Brak -- klasa nie dziedziczy z QObject.

## Stan (Q_PROPERTY)
Brak -- klasa nie uzywa Q_PROPERTY.

## Publiczne API (metody z znaczeniem biznesowym)
| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| serialNumber() | brak | Zwraca numer seryjny adaptera | - |
| setSerialNumber() | unsigned num | Ustawia numer seryjny adaptera | - |
| hpiVersion() | brak | Zwraca pelna wersje HPI jako uint32_t (zakodowana: major<<16, minor<<8, point) | - |
| setHpiVersion() | uint32_t ver | Ustawia pelna wersje HPI | - |
| hpiMajorVersion() | brak | Zwraca major wersji HPI (bity 16-31) | - |
| hpiMinorVersion() | brak | Zwraca minor wersji HPI (bity 8-15) | - |
| hpiPointVersion() | brak | Zwraca point wersji HPI (bity 0-7) | - |
| dspMajorVersion() | brak | Zwraca major wersji DSP firmware | - |
| setDspMajorVersion() | unsigned ver | Ustawia major wersji DSP | - |
| dspMinorVersion() | brak | Zwraca minor wersji DSP firmware | - |
| setDspMinorVersion() | unsigned ver | Ustawia minor wersji DSP | - |
| pcbVersion() | brak | Zwraca wersje PCB jako znak (np. 'A', 'B') | - |
| setPcbVersion() | char ver | Ustawia wersje PCB | - |
| assemblyVersion() | brak | Zwraca wersje montazu karty | - |
| setAssemblyVersion() | unsigned ver | Ustawia wersje montazu | - |
| clear() | brak | Resetuje wszystkie pola do wartosci domyslnych (0, pcb='0') | - |

## Stany i kategorie (enums)
Brak.

## Reguly biznesowe (z implementacji)
- Regula: Wersja HPI jest przechowywana jako pojedynczy uint32_t z kodowaniem bitowym: major w bitach 16-31, minor w bitach 8-15, point w bitach 0-7.
- Zrodlo: hpiMajorVersion(), hpiMinorVersion(), hpiPointVersion()
- Regula: Domyslna wartosc pcbVersion po clear() to znak '0' (nie litera).
- Zrodlo: clear()

## Linux-specific uzycia
Brak.

## Zaleznosci od innych klas tego artifaktu
Brak.

## Zaleznosci od shared libraries
Brak.
