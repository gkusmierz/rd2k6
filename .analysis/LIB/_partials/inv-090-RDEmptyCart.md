---
partial_id: "090"
class: RDEmptyCart
source_files:
  - lib/rdemptycart.h
  - lib/rdemptycart.cpp
phase: 2
status: done
---

# RDEmptyCart

## Rola
Visual placeholder and drag source representing an empty cart slot. Displays an "Empty Cart" label and initiates drag-and-drop with cart number 0 when clicked.

## Dziedziczenie
- **Bazowa:** QWidget
- **Q_OBJECT:** tak

## Signals
Brak.

## Slots
Brak.

## Kluczowe metody publiczne
| Metoda | Opis |
|--------|------|
| `RDEmptyCart(QWidget *parent=0)` | Konstruktor -- tworzy etykiete |
| `~RDEmptyCart()` | Destruktor |
| `sizeHint()` | Rozmiar preferowany |
| `sizePolicy()` | Polityka rozmiaru |

## Metody chronione
| Metoda | Opis |
|--------|------|
| `mousePressEvent(QMouseEvent *e)` | Rozpoczyna drag-and-drop: tworzy RDCartDrag z cartnum=0 |

## Pola prywatne
- `QLabel *empty_label` -- etykieta "Empty Cart"

## Zaleznosci
- Uzywa `RDCartDrag` do tworzenia obiektu drag.

## Zachowanie
- Wyswietla etykiete tekstowa wskazujaca pusty slot carta.
- Przy kliknieciu lewym przyciskiem myszy tworzy `RDCartDrag` z numerem carta 0 i inicjuje operacje drag-and-drop.
- Sluzy jako zrodlo drag dla "wyczyszczenia" slotu carta (upuszczenie pustego carta = usuwanie przypisania).
