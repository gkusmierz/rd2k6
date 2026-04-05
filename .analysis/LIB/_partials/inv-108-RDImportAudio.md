---
partial_id: 108
artifact: LIB
class_name: RDImportAudio
header_file: lib/rdimport_audio.h
source_file: lib/rdimport_audio.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDImportAudio

## Typ Qt
Dialog (dziedziczy RDDialog)

## Odpowiedzialność (WHAT)
Dialog GUI do importu i eksportu plików audio. Pozwala użytkownikowi wybrać plik źródłowy, ustawić parametry konwersji (normalizacja, autotrim, kanały) i zaimportować audio do systemu lub wyeksportować z systemu do pliku.

## Sygnały
Brak (dialog modalny)

## Sloty
| Slot | Widoczność | Co robi |
|------|------------|---------|
| filenameChangedData | private | Reaguje na zmianę nazwy pliku |
| normalizeCheckData | private | Toggle normalizacji |
| autotrimCheckData | private | Toggle autotrim |
| selectInputFileData | private | Wybór pliku wejściowego |
| selectOutputFileData | private | Wybór pliku wyjściowego |
| selectOutputFormatData | private | Wybór formatu wyjściowego |
| importData | private | Wykonaj import |
| cancelData | private | Anuluj |

## Stan (Q_PROPERTY)
Brak

## Publiczne API (metody z znaczeniem biznesowym)
| Metoda | Parametry | Efekt | Warunki |
|--------|-----------|-------|---------|
| enableAutotrim | bool | Włącza/wyłącza opcję autotrim | - |
| setAutotrimLevel | int | Ustawia poziom autotrim | - |
| enableNormalization | bool | Włącza/wyłącza normalizację | - |
| setNormalizationLevel | int | Ustawia poziom normalizacji | - |
| setChannels | int | Ustawia liczbę kanałów | - |

## Stany i kategorie (enums)
Brak

## Reguły biznesowe (z implementacji)
- Import i eksport używają RDAudioConvert do konwersji formatów
- Pasek postępu pokazuje progress operacji
- Domyślne ustawienia audio ładowane z RDSettings

## Linux-specific użycia
Brak

## Tabele DB (CRUD)
Brak bezpośredniego SQL — deleguje do RDAudioImport/RDAudioExport

## Zależności od innych klas tego artifaktu
RDSettings, RDAudioConvert, RDWaveData

## Zależności od shared libraries
Brak
