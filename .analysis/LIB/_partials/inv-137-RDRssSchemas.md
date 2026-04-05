---
partial_id: 137
artifact: LIB
class_name: RDRssSchemas
header_file: lib/rdrssschemas.h
source_file: lib/rdrssschemas.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDRssSchemas

## Typ Qt
Plain C++ (Constants/Registry)

## Odpowiedzialność (WHAT)
Rejestr schematów RSS dla podcastów. Definiuje szablony XML (header, channel, item) i constrainty (rozmiary obrazów, wsparcie dla kategorii/linków/komentarzy) per schemat RSS. Używane przez RDFeed do generowania feedów RSS.

## Stany i kategorie (enums)
| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| RssSchema | CustomSchema/Rss202Schema/AppleSchema/... | Typy schematów RSS |

## Publiczne API
name, minimumImageSize, maximumImageSize, headerTemplate, channelTemplate, itemTemplate, supportsItemImages/Categories/Links/Comments, categories, subCategories

## Zależności
Brak
