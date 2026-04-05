---
partial_id: 144
artifact: LIB
class_name: RDFormPost
header_file: lib/rdformpost.h
source_file: lib/rdformpost.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDFormPost

## Typ Qt
Plain C++ (Parser)

## Odpowiedzialność (WHAT)
Parser formularzy HTTP POST — obsługuje oba kodowania: URL-encoded i multipart/form-data. Wyciąga pary klucz-wartość, obsługuje upload plików (zapisuje do temp dir). Używany przez rdxport (HTTP API) do parsowania requestów.

## Stany i kategorie (enums)
| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| Encoding | UrlEncoded/Multipart/AutoEncoding | Typ kodowania |
| Error | ErrorOk/ErrorNotPost/ErrorNoEncoding/ErrorMalformedData/ErrorPostTooLarge/ErrorInternal | Kody błędów |

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| names() | Lista nazw pól |
| value(name) | Wartość pola |
| getValue(name, type*) | Typowane getValue (int, bool, QString, QDate, ...) |
| isFile(name) | Czy pole jest uploadem pliku |
| authenticate() | Walidacja user/pass z DB |
| tempDir() | Ścieżka do temp directory z uploadami |
| urlEncode/urlDecode | Statyczne utility |

## Tabele DB
USERS (READ — authenticate)

## Zależności
RDUser (autentykacja), QTemporaryDir
