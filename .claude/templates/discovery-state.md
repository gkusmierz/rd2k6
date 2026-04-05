---
phase: 1
artifact: {ARTIFACT_ID}
artifact_name: {pełna nazwa}
status: done
completed_at: ~
agent_version: 1.0.0
---

# Discovery State: {ARTIFACT_NAME}

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder źródłowy | {ścieżka} |
| CMakeLists.txt | {ścieżka lub "brak"} |
| Target CMake | {nazwa targetu} |
| Typ | application / library |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | ~ |
| Pliki .cpp | ~ |
| Pliki .ui | ~ |
| Pliki .qml | ~ |
| Linie kodu (est.) | ~ |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | {plik} | int main(argc, argv) | Punkt startowy procesu |
| QApplication | {plik} | QApplication a | Inicjalizacja Qt |
| QMainWindow | {plik} | {KlasaGłówna} | Główne okno |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| {NazwaKlasy} | {plik.h} | QMainWindow/QDialog/QWidget/QObject/etc. | {jedno zdanie} |

## Pliki źródłowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | {klasa.h} | {klasa.cpp} | - |

### Pliki tylko .h (bez .cpp)

| Header | Zawartość |
|--------|-----------|
| {plik.h} | {opis: interface/template/inline impl} |

### Pliki tylko .cpp (bez .h)

| Source | Zawartość |
|--------|-----------|
| {plik.cpp} | {opis: main/utility} |

### Pliki pomijane (generowane)

| Plik | Powód pominięcia |
|------|-----------------|
| moc_*.cpp | Generowane przez Qt moc |
| ui_*.h | Generowane z .ui przez uic |

## Pliki testowe

| Plik | Framework | Testowane klasy |
|------|-----------|-----------------|
| {plik} | QTest | {lista klas} |

Jeśli brak: "Brak plików testowych dla tego artifaktu."

## CMake Target Definition

```cmake
{wklejona zawartość add_executable/add_library z CMakeLists.txt}
```

## Zależności (z CMake target_link_libraries)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| {librd} | internal | tak |
| {Qt6::Widgets} | Qt framework | tak |
