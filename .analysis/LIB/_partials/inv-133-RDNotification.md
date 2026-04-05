---
partial_id: 133
artifact: LIB
class_name: RDNotification
header_file: lib/rdnotification.h
source_file: lib/rdnotification.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDNotification

## Typ Qt
Plain C++ (Value Object)

## Odpowiedzialność (WHAT)
Wiadomość w systemie event bus — informuje o zmianach w obiektach (cart, log, feed, etc.). Serializacja/deserializacja z XML do przesyłania między komponentami. Każda notyfikacja ma typ obiektu, akcję (Add/Modify/Delete) i ID obiektu.

## Stany i kategorie (enums)
| Enum | Wartości | Znaczenie |
|------|----------|-----------|
| Type | NullType/CartType/LogType/PypadType/FeedType/FeedItemType/DropboxType | Typ obiektu |
| Action | NullAction/AddAction/ModifyAction/DeleteAction/NoAction | Rodzaj zmiany |

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| type/setType | Typ obiektu |
| action/setAction | Rodzaj akcji |
| id/setId | ID obiektu (QVariant) |
| isValid | Czy notyfikacja jest kompletna |
| read/write | Serializacja XML |
| typeString/actionString | Tekstowe reprezentacje |

## Tabele DB
Brak (in-memory event bus)

## Zależności
Brak
