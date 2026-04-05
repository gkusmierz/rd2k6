---
partial_id: "091"
class: RDCartDrag
source_files:
  - lib/rdcartdrag.h
  - lib/rdcartdrag.cpp
phase: 2
status: done
---

# RDCartDrag

## Rola
Drag-and-drop data object for Rivendell carts. Encodes cart number, color, and title into MIME data for inter-widget drag operations. Provides static decode methods to extract cart info or populate an RDLogLine from dropped data.

## Dziedziczenie
- **Bazowa:** Q3StoredDrag (Qt3 compat stored drag object)
- **Q_OBJECT:** nie (brak Q_OBJECT)

## Signals
Brak.

## Slots
Brak.

## Kluczowe metody publiczne
| Metoda | Opis |
|--------|------|
| `RDCartDrag(unsigned cartnum, const QPixmap *icon, const QColor &color, QWidget *src=0)` | Konstruktor z ikona |
| `RDCartDrag(unsigned cartnum, const QString &title, const QColor &color, QWidget *src=0)` | Konstruktor z tytulem |
| `static canDecode(QMimeSource *e)` | Sprawdz czy zrodlo MIME zawiera dane carta |
| `static decode(QMimeSource *e, unsigned *cartnum, QColor *color=NULL, QString *title=NULL)` | Dekoduj numer carta, kolor i tytul z MIME |
| `static decode(QMimeSource *e, RDLogLine *ll, RDLogLine::TransType next_trans, int log_mach, bool timescale, RDLogLine::TransType trans)` | Dekoduj do RDLogLine -- uzywa RDCart do wczytania metadanych |

## Metody prywatne
| Metoda | Opis |
|--------|------|
| `SetData(unsigned cartnum, const QColor &color, const QString &title)` | Serializuj dane carta do formatu MIME |

## Zaleznosci
- `RDCart` -- uzywa do wczytania metadanych carta przy decode do RDLogLine
- `RDLogLine` -- cel dekodowania (wypelnia linie loga z carta)

## Format danych MIME
- Koduje: numer carta (unsigned), kolor (QColor), tytul (QString)
- Typ MIME: Q3StoredDrag format (application-specific)

## Zachowanie
- Konstruktor pakuje dane carta (numer, kolor, tytul) w format MIME przez SetData().
- `canDecode()` sprawdza format MIME zrodla.
- `decode()` wariant prosty: wyciaga cartnum, kolor, tytul.
- `decode()` wariant RDLogLine: wczytuje pelne metadane carta z bazy przez RDCart i wypelnia RDLogLine -- umozliwia drag carta bezposrednio do logu.
