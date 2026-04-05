---
phase: 1
artifact: UTL
artifact_name: utils (CLI)
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: utils (CLI)

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | utils/ |
| CMakeLists.txt | brak (autotools: utils/Makefile.am + 23 sub-Makefile.am) |
| Targety | 23 osobne bin_PROGRAMS / sbin_PROGRAMS (po jednym na podkatalog) |
| Typ | tool (zestaw 23 niezaleznych narzedzi CLI i GUI) |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 35 |
| Pliki .cpp | 45 |
| Pliki .c | 2 (rdgen: pure C) |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .ts | 26 (tlumaczenia: rddgimport, rddiscimport, rdgpimon, rmlsend) |
| Podkatalogi | 23 |
| Linie kodu (est.) | ~14500 (szacunek na podstawie liczby plikow i rozmiaru typowego narzedzia) |

## Architektura artefaktu

UTL to **kolekcja 23 niezaleznych narzedzi** (nie jedna aplikacja). Kazde narzedzie to osobny executable z wlasnym main(). Wiekszosc to CLI headless (QApplication(argc,argv,false)), 8 ma GUI.

### Podzial na kategorie

| Kategoria | Narzedzia | Liczba |
|-----------|-----------|--------|
| CLI headless | rdcheckcuts, rdcleandirs, rdclilogedit, rdcollect, rdconvert, rddelete, rdexport, rdimport, rdmaint, rdmarkerset, rdmetadata, rdrender, rdselect_helper | 13 |
| GUI (QApplication z GUI) | rdalsaconfig, rddbconfig, rddgimport, rddiscimport, rdgpimon, rdpopup, rdsoftkeys, rmlsend | 8 |
| GUI + CLI dual-mode | rmlsend (CLI lub GUI w zaleznosci od argumentow) | 1 (w/w) |
| Pure C (bez Qt) | rdgen | 1 |
| Daemon/sbin | rdcleandirs, rddbmgr, rdmarkerset (sbin_PROGRAMS) | 3 |

## Entry Points

Kazde narzedzie ma wlasny main(). 22 uzywa QApplication, 1 (rdgen) to pure C.

| Narzedzie | Plik main() | QApp mode | Glowna klasa |
|-----------|-------------|-----------|--------------|
| rdalsaconfig | rdalsaconfig.cpp:399 | QApplication (GUI) + QCoreApplication (autogen) | MainWidget:RDWidget, Autogen:QObject |
| rdcheckcuts | rdcheckcuts.cpp:153 | QApplication(false) | MainObject:QObject |
| rdcleandirs | rdcleandirs.cpp:84 | QApplication(false) | MainObject:QObject |
| rdclilogedit | rdclilogedit.cpp:181 | QApplication(false) | MainObject:QObject |
| rdcollect | rdcollect.cpp:207 | QApplication(false) | MainObject:QObject |
| rdconvert | rdconvert.cpp:195 | QApplication(false) | MainObject:QObject |
| rddbconfig | rddbconfig.cpp:443 | QApplication (GUI) | MainWidget:RDWidget |
| rddbmgr | rddbmgr.cpp:483 | QApplication(false) | MainObject:QObject |
| rddelete | rddelete.cpp:330 | QApplication(false) | MainObject:QObject |
| rddgimport | rddgimport.cpp:618 | QApplication (GUI) | MainWidget:RDWidget |
| rddiscimport | rddiscimport.cpp:681 | QApplication (GUI) | MainWidget:RDWidget |
| rdexport | rdexport.cpp:565 | QApplication(false) | MainObject:QObject |
| rdgen | rdgen.c | brak (pure C) | brak (funkcje C + wavlib) |
| rdgpimon | rdgpimon.cpp:742 | QApplication (GUI) | MainWidget:RDWidget |
| rdimport | rdimport.cpp:2504 | QApplication(false) | MainObject:QObject |
| rdmaint | rdmaint.cpp:430 | QApplication(false) | MainObject:QObject |
| rdmarkerset | rdmarkerset.cpp:394 | QApplication(false) | MainObject:QObject |
| rdmetadata | rdmetadata.cpp:307 | QApplication(false) | MainObject:QObject |
| rdpopup | rdpopup.cpp:60 | QApplication (GUI) | brak (standalone main + WordWrap helper) |
| rdrender | rdrender.cpp:338 | QApplication(false) | MainObject:QObject |
| rdselect_helper | rdselect_helper.cpp:299 | QCoreApplication | MainObject:QObject |
| rdsoftkeys | rdsoftkeys.cpp:209 | QApplication (GUI) | MainWidget:QWidget |
| rmlsend | rmlsend.cpp:428 | QApplication (GUI lub CLI) | MainWidget:RDWidget, MainObject:QObject |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Narzedzie | Opis |
|-------|---------|--------|-----------|------|
| MainObject | rdcheckcuts/rdcheckcuts.h | QObject | rdcheckcuts | Walidacja cut audio w bibliotece |
| MainObject | rdcleandirs/rdcleandirs.h | QObject | rdcleandirs | Czyszczenie katalogow |
| MainObject | rdclilogedit/rdclilogedit.h | QObject | rdclilogedit | CLI edytor logow radiowych |
| MainObject | rdcollect/rdcollect.h | QObject | rdcollect | Zbieranie/kopiowanie audio |
| MainObject | rdconvert/rdconvert.h | QObject | rdconvert | Konwersja formatow audio |
| MainWidget | rddbconfig/rddbconfig.h | RDWidget | rddbconfig | GUI konfiguracji bazy danych |
| MySqlLogin | rddbconfig/mysql_login.h | RDDialog | rddbconfig | Dialog logowania MySQL |
| MainObject | rddbmgr/rddbmgr.h | QObject | rddbmgr | Manager schematu bazy danych (create/update/check/revert) |
| MainObject | rddelete/rddelete.h | QObject | rddelete | Usuwanie cartow/cutow |
| MainWidget | rddgimport/rddgimport.h | RDWidget | rddgimport | GUI importu Digital Guardian |
| MainWidget | rddiscimport/rddiscimport.h | RDWidget | rddiscimport | GUI importu z plyt CD |
| MetaRecord | rddiscimport/metarecord.h | plain C++ | rddiscimport | Rekord metadanych importu |
| MetaLibrary | rddiscimport/metalibrary.h | plain C++ | rddiscimport | Biblioteka metadanych importu |
| MainObject | rdexport/rdexport.h | QObject | rdexport | Eksport audio z biblioteki |
| MainWidget | rdgpimon/rdgpimon.h | RDWidget | rdgpimon | GUI monitor GPI/GPO |
| GpiLabel | rdgpimon/gpi_label.h | RDWidget | rdgpimon | Widget etykiety GPI |
| MainObject | rdimport/rdimport.h | QObject | rdimport | Masowy import audio (CLI) |
| MarkerSet | rdimport/markerset.h | plain C++ | rdimport | Zestaw markerow audio |
| Journal | rdimport/journal.h | plain C++ | rdimport | Journal importu |
| MainObject | rdmaint/rdmaint.h | QObject | rdmaint | Maintenance/czyszczenie systemu |
| MainObject | rdmarkerset/rdmarkerset.h | QObject | rdmarkerset | Ustawianie markerow audio |
| MainObject | rdmetadata/rdmetadata.h | QObject | rdmetadata | Odczyt/zapis metadanych audio |
| MainObject | rdrender/rdrender.h | QObject | rdrender | Renderowanie logow do audio |
| MainObject | rdselect_helper/rdselect_helper.h | QObject | rdselect_helper | Helper wyboru systemu (rdselect) |
| MainWidget | rdsoftkeys/rdsoftkeys.h | QWidget | rdsoftkeys | GUI softkeys (makro-klawisze) |
| MainWidget | rmlsend/rmlsend.h | RDWidget | rmlsend | GUI wysylania komend RML |
| MainObject | rmlsend/rmlsend.h | QObject | rmlsend | CLI wysylania komend RML |
| MainWidget | rdalsaconfig/rdalsaconfig.h | RDWidget | rdalsaconfig | GUI konfiguracji ALSA |
| Autogen | rdalsaconfig/rdalsaconfig.h | QObject | rdalsaconfig | Auto-generowanie konfiguracji ALSA |
| RDAlsaModel | rdalsaconfig/rdalsamodel.h | QAbstractListModel | rdalsaconfig | Model danych urzadzen ALSA |
| AlsaItem | rdalsaconfig/alsaitem.h | Q3ListBoxText | rdalsaconfig | Element listy urzadzen ALSA |
| RDAlsaCard | rdalsaconfig/rdalsacard.h | plain C++ | rdalsaconfig | Abstrakcja karty ALSA |
| Event | rddgimport/event.h | plain C++ | rddgimport | Zdarzenie importu DG |

## Pliki zrodlowe

### Pary .h/.cpp (per podkatalog)

| Podkatalog | Pary .h/.cpp | Standalone .cpp | Standalone .h | Standalone .c |
|------------|-------------|-----------------|---------------|---------------|
| rdalsaconfig | 4 (alsaitem, rdalsacard, rdalsamodel, rdalsaconfig) | — | — | — |
| rdcheckcuts | 1 (rdcheckcuts) | — | — | — |
| rdcleandirs | 1 (rdcleandirs) | — | — | — |
| rdclilogedit | 1 (rdclilogedit) | operations.cpp, parser.cpp, help.cpp | — | — |
| rdcollect | 1 (rdcollect) | — | — | — |
| rdconvert | 1 (rdconvert) | — | — | — |
| rddbconfig | 3 (rddbconfig, db, mysql_login) | createdb.cpp | createdb.h | — |
| rddbmgr | 1 (rddbmgr) | create.cpp, modify.cpp, schemamap.cpp, check.cpp, revertschema.cpp, printstatus.cpp, updateschema.cpp | — | — |
| rddelete | 1 (rddelete) | — | — | — |
| rddgimport | 2 (rddgimport, event) | — | — | — |
| rddiscimport | 2 (rddiscimport, metarecord) + metalibrary (.h+.cpp) | — | — | — |
| rdexport | 1 (rdexport) | — | — | — |
| rdgen | 0 | — | wavlib.h | rdgen.c, wavlib.c |
| rdgpimon | 2 (rdgpimon, gpi_label) | — | — | — |
| rdimport | 3 (rdimport, journal, markerset) | — | — | — |
| rdmaint | 1 (rdmaint) | — | — | — |
| rdmarkerset | 1 (rdmarkerset) | — | — | — |
| rdmetadata | 1 (rdmetadata) | — | — | — |
| rdpopup | 1 (rdpopup) | — | — | — |
| rdrender | 1 (rdrender) | mainloop.cpp | — | — |
| rdselect_helper | 1 (rdselect_helper) | — | — | — |
| rdsoftkeys | 1 (rdsoftkeys) | — | — | — |
| rmlsend | 1 (rmlsend) | — | — | — |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_*.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artefaktu.

## Autotools Target Definitions

Kazdy podkatalog ma osobny Makefile.am z jednym target (bin_PROGRAMS lub sbin_PROGRAMS).

### Targety sbin (system admin)

| Target | Podkatalog | Opis |
|--------|------------|------|
| rdcleandirs | rdcleandirs/ | sbin_PROGRAMS |
| rddbmgr | rddbmgr/ | sbin_PROGRAMS |
| rdmarkerset | rdmarkerset/ | sbin_PROGRAMS |

### Targety bin (user)

Pozostale 20 narzedzi to bin_PROGRAMS.

### Warunkowa kompilacja

rdalsaconfig jest kompilowany tylko gdy `ALSA_RD_AM` jest zdefiniowane (if ALSA_RD_AM w utils/Makefile.am).

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Narzedzia | Typ |
|------------|-----------|-----|
| @LIB_RDLIBS@ (librd) | wszystkie oprocz rdgen i rdselect_helper | internal |
| @LIBVORBIS@ | wszystkie oprocz rdgen i rdselect_helper | external (audio codec) |
| @QT4_LIBS@ | wszystkie oprocz rdgen i rdselect_helper | Qt framework |
| @MUSICBRAINZ_LIBS@ | wszystkie oprocz rdgen | external (disc lookup) |
| -lQt3Support | wszystkie Qt-based | Qt3 compat |
| @LIBALSA@ | rdalsaconfig, rddbconfig | external (ALSA audio) |
| -lm | rdgen | system (math) |
| -lQtCore -lQtNetwork | rdselect_helper (minimalne Qt, bez librd!) | Qt minimal |

### Uwaga: rdselect_helper

rdselect_helper jest szczegolny — nie linkuje z librd (@LIB_RDLIBS@), tylko z minimalnymi bibliotekami Qt. Jest to celowe: dziala jako helper procesu rdselect i nie wymaga pelnej inicjalizacji Rivendell.

### Uwaga: rdgen

rdgen jest jedynym narzedziem pure C (bez Qt, bez librd). Generuje pliki WAV, linkuje tylko z -lm.

## Tlumaczenia (.ts)

| Narzedzie | Jezyki |
|-----------|--------|
| rddgimport | fr, nb, nn, de, pt_BR, es |
| rddiscimport | pt_BR, fr, es, nb, de, nn |
| rdgpimon | fr, nb, pt_BR, de, cs, es, nn |
| rmlsend | de, nn, nb, es, cs, fr, pt_BR |

Tylko 4 z 23 narzedzi maja tlumaczenia (te z GUI).
