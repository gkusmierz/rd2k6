---
partial_id: 193
artifact: LIB
class_name: rdxport_interface.h
header_file: lib/rdxport_interface.h
source_file: null
phase: 2
status: done
agent_version: 1.1.0
---

# rdxport_interface.h — Interfejs protokołu RDXport

## Typ Qt
Header-only (#define)

## Odpowiedzialność (WHAT)
Definiuje kody komend HTTP API rdxport — RDXPORT_COMMAND_EXPORT, RDXPORT_COMMAND_IMPORT, RDXPORT_COMMAND_LISTCARTS, etc. Interfejs między klientami (librd) a serwerem (rdxport CGI).

## Kluczowe stałe
~40 stałych RDXPORT_COMMAND_* definiujących pełne API:
- Audio: EXPORT, IMPORT, DELETE_AUDIO, COPY_AUDIO, TRIM_AUDIO, AUDIOINFO, PEAKS
- Cart/Cut: LISTCARTS, LISTCUTS, ADDCART, ADDCUT, REMOVECART, REMOVECUT, EDITCART, EDITCUT
- Log: LISTLOGS, LISTLOG, ADDLOG, DELETELOG, SAVELOG
- Scheduler: LISTSCHEDCODES, ASSIGNSCHEDCODE, UNASSIGNSCHEDCODE
- System: LISTGROUPS, LISTSERVICES, SYSTEMSETTINGS
- Podcast: LISTFEEDS, POSTAUDIO, REMOVEPOST

## Reguły biznesowe
- Te kody definiują kontrakt API między klientem a serwerem
- Każda komenda ma określone parametry (przesyłane jako multipart POST)

## Zależności
Brak (header-only, używany przez klientów HTTP API)
