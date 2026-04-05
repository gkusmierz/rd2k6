---
phase: 1
artifact: LGN
artifact_name: rdlogin
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: rdlogin

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder źródłowy | rdlogin/ |
| CMakeLists.txt | brak (autotools: rdlogin/Makefile.am) |
| Target autotools | bin_PROGRAMS = rdlogin |
| Typ | application |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 1 |
| Pliki .cpp | 1 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .ts (i18n) | 7 |
| Linie kodu (est.) | ~380 |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | rdlogin.cpp:272 | int main(argc, argv) | Punkt startowy procesu |
| QApplication | rdlogin.cpp:275 | QApplication a(argc,argv) | Inicjalizacja Qt |
| RDWidget (główne okno) | rdlogin.h:33 | MainWidget : RDWidget | Główne (i jedyne) okno aplikacji — login/logout użytkownika |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainWidget | rdlogin.h | RDWidget (QWidget) | Jedyna klasa — okno logowania/wylogowania użytkownika Rivendell |

## Pliki źródłowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | rdlogin.h | rdlogin.cpp | MainWidget + main() — cała logika aplikacji w jednym pliku |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomijane (generowane)

| Plik | Powód pominięcia |
|------|-----------------|
| moc_rdlogin.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plików testowych dla tego artifaktu.

## Build Target Definition (autotools)

```makefile
bin_PROGRAMS = rdlogin

dist_rdlogin_SOURCES = rdlogin.cpp rdlogin.h

nodist_rdlogin_SOURCES = moc_rdlogin.cpp

rdlogin_LDADD = @LIB_RDLIBS@ @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

## Zależności (z Makefile.am LDADD)

| Biblioteka | Typ | Czy shared? |
|------------|-----|-------------|
| @LIB_RDLIBS@ (librd) | internal | tak |
| @QT4_LIBS@ | Qt framework | tak |
| -lQt3Support | Qt3 compat layer | tak |
| @LIBVORBIS@ | external | tak |
| @MUSICBRAINZ_LIBS@ | external | tak |

## Uwagi

- Ekstremalnie prosta aplikacja: 1 klasa, 1 para plików, ~380 LOC.
- UI budowane programowo (brak .ui): QComboBox (lista userów) + QLineEdit (hasło) + 3 przyciski (Set User / Default User / Cancel).
- Dwa tryby wyświetlania username: QComboBox (lista z DB) lub QLineEdit (ręczne wpisanie), sterowane przez `rda->system()->showUserList()`.
- Komunikacja z ripcd przez RIPC (sygnały connected/userChanged).
- Filtrowanie użytkowników: SELECT LOGIN_NAME FROM USERS WHERE ADMIN_CONFIG_PRIV="N" — ukrywa adminów.
- Logowanie: walidacja hasła przez `RDUser::checkPassword()`, zmiana usera przez `rda->ripc()->setUser()`.
- Wylogowanie: reset do `rda->station()->defaultName()`.
- Po udanym logowaniu/wylogowaniu: natychmiast `exit(0)` (cancelData) — aplikacja jest jednorazowa.
