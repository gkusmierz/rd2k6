---
phase: 1
artifact: WGT
artifact_name: webget.cgi
status: done
completed_at: 2026-04-05
agent_version: 1.1.0
---

# Discovery State: webget.cgi

## Lokalizacja

| Pole | Wartość |
|------|---------|
| Folder zrodlowy | web/webget/ |
| CMakeLists.txt | brak (autotools: web/webget/Makefile.am) |
| Target autotools | webget.cgi (libexec_PROGRAMS) |
| Typ | web (CGI) |

## Statystyki

| Typ | Liczba |
|-----|--------|
| Pliki .h | 1 |
| Pliki .cpp | 1 |
| Pliki .js | 1 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Pliki .qrc | 0 |
| Pliki .ts | 0 |
| Linie kodu (est.) | ~1061 (868 .cpp + 61 .h + 132 .js) |

## Entry Points

| Typ | Plik | Symbol | Opis |
|-----|------|--------|------|
| main() | webget.cpp:863 | int main(argc, argv) | Punkt startowy CGI |
| QApplication | webget.cpp:865 | QApplication a(argc,argv,false) | Inicjalizacja Qt (headless, false=no GUI) |
| MainObject | webget.cpp:43 | MainObject::MainObject(QObject*) | Cala logika w konstruktorze (CGI pattern) |

## Klasy Qt (identyfikowane)

| Klasa | Plik .h | Typ Qt | Opis |
|-------|---------|--------|------|
| MainObject | webget.h | QObject (Q_OBJECT) | Jedyna klasa -- obsluga HTTP GET/POST, autentykacja, upload/download audio |

## Pliki zrodlowe

### Pary .h/.cpp

| Nr | Header | Source | Uwagi |
|----|--------|--------|-------|
| 001 | webget.h | webget.cpp | Jedyna para; cala logika CGI |

### Pliki tylko .h (bez .cpp)

Brak.

### Pliki tylko .cpp (bez .h)

Brak.

### Pliki pomocnicze (nie-C++)

| Plik | Typ | Opis |
|------|-----|------|
| webget.js | JavaScript (client-side) | Frontend: ProcessGet(), ProcessPut(), SendForm() via XMLHttpRequest, obsluga odpowiedzi (download audio blob / login redirect) |

### Pliki pomijane (generowane)

| Plik | Powod pominiecia |
|------|-----------------|
| moc_webget.cpp | Generowane przez Qt moc |

## Pliki testowe

Brak plikow testowych dla tego artifaktu.

## Autotools Target Definition

```makefile
# web/webget/Makefile.am
libexec_PROGRAMS = webget.cgi

dist_webget_cgi_SOURCES = webget.cpp webget.h
nodist_webget_cgi_SOURCES = moc_webget.cpp

webget_cgi_LDADD = @LIB_RDLIBS@ -lsndfile @LIBVORBIS@ @QT4_LIBS@ @MUSICBRAINZ_LIBS@ -lQt3Support
```

Instalacja: webget.cgi do $(libexecdir) z setuid root (chmod 4755), webget.js kopiowany obok.

## Zaleznosci (z Makefile.am LDADD)

| Biblioteka | Typ | Opis |
|------------|-----|------|
| @LIB_RDLIBS@ (librd) | internal | Glowna biblioteka Rivendell |
| -lsndfile | external | Audio file I/O |
| @LIBVORBIS@ | external | Ogg Vorbis codec |
| @QT4_LIBS@ | Qt framework | Qt 4 core/GUI |
| @MUSICBRAINZ_LIBS@ | external | MusicBrainz lookup |
| -lQt3Support | Qt compat | Qt3 compatibility layer |

## Includes (z webget.cpp)

| Naglowek | Zrodlo | Cel |
|----------|--------|-----|
| rdapplication.h | librd | RDApplication -- inicjalizacja, config, user, syslog |
| rdescape_string.h | librd | RDEscapeString -- SQL escaping |
| rdgroup.h | librd | RDGroup -- walidacja grupy, email notify |
| rdsendmail.h | librd | RDSendMail -- email notifications |
| rdweb.h | librd | Utilities webowe |
| rdaudioconvert.h | librd | RDAudioConvert -- konwersja formatow audio |
| rdformpost.h | librd | RDFormPost -- parsowanie multipart/form-data |
| openssl/sha.h | system | SHA hashing (auth) |

## Architektura (podsumowanie)

webget.cgi to prosty CGI (nie daemon, nie serwer) -- uruchamiany per-request przez web server (Apache).
Setuid root na starcie, natychmiast dropuje do uid/gid Rivendell.

Glowne operacje:
1. **GET request** -> ServeLogin() -- wyswietla formularz logowania HTML
2. **POST bez direction** -> ServeForm() -- wyswietla glowny formularz (get/put audio)
3. **POST direction=get** -> GetAudio() -- eksport audio z Rivendell (cart+cut -> plik audio w wybranym formacie)
4. **POST direction=put** -> PutAudio() -- import audio do Rivendell (plik -> rdimport CLI)

Autentykacja: ticket-based (RDUser::ticketIsValid) lub username/password.
Komunikacja z ripcd przez RPC (signal/slot: ripcConnectedData).
Import audio delegowany do zewnetrznego procesu `rdimport` (QProcess).
