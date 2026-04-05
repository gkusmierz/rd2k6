---
partial_id: 155
artifact: LIB
class_name: RDWeb
header_file: lib/rdweb.h
source_file: lib/rdweb.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDWeb + RDWebResult

## Typ Qt
Plain C++ (Utility)

## Odpowiedzialność (WHAT)
**RDWeb**: Zbiór globalnych funkcji utility do operacji HTTP/web — XML escaping, timestamp formatting, MIME type detection, multipart encoding helpers.

**RDWebResult** (lib/rdwebresult.h/.cpp): Kontener wyniku operacji web API — parsuje odpowiedź XML z rdxport (ResponseCode, ErrorString, AudioConvertError).

## Publiczne API (RDWeb)
RDXmlField(), RDXmlEscape(), RDXmlTimeStamp(), RDUrlEscape(), RDCheckAuthority(), RDMimeType()

## Publiczne API (RDWebResult)
responseCode, errorString, audioConvertError + parsowanie z XML

## Zależności
Brak
