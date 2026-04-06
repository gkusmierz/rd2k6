---
phase: 3
artifact: HPI
artifact_name: librdhpi
status: done
completed_at: 2026-04-06
ui_mode: B (Code-first)
windows_total: 1
spot_check_issues: 0
agent_version: 1.6.0
---

# UI Contracts: librdhpi

## Statystyki UI

| Typ | Liczba |
|-----|--------|
| MainWindow | 0 |
| Dialog | 0 |
| Widget | 1 |
| Panel | 0 |
| Lacznie okna/widgety | 1 |
| Pliki .ui | 0 |
| Pliki .qml | 0 |
| Screenshoty | 0 |

**Tryb ekstrakcji:** TRYB B (Code-first) -- brak plikow .ui ani .qml.

Biblioteka librdhpi jest w glownej mierze nie-UI. Jedynym widgetem jest RDHPISoundSelector (lista wyboru karty/portu). Pozostale 4 klasy to logika sprzetowa (QObject) i value object (plain C++).

---

## RDHPISoundSelector

### Identyfikacja

| Pole | Wartosc |
|------|---------|
| Klasa | RDHPISoundSelector |
| Typ | Widget (Q3ListBox) |
| Tytul okna | brak (widget osadzany w innym oknie) |
| Modalnosc | N/A (widget, nie dialog) |
| Rodzic | dowolny QWidget |

### Zrodla ekstrakcji

| Zrodlo | Status | Plik |
|--------|--------|------|
| Kod C++ | TAK | rdhpi/rdhpisoundselector.cpp |
| Plik .ui | N/A | -- |
| Plik .qml | N/A | -- |
| Screenshot | brak | -- |
| Mockup HTML | brak | -- |

### Dane wejsciowe (co widget pobiera zeby sie wyswietlic)

| Dane | Typ | Zrodlo | Wymagane |
|------|-----|--------|----------|
| dev_class | RDHPISoundCard::DeviceClass | konstruktor | tak |
| config | RDConfig* | konstruktor | tak |
| parent | QWidget* | konstruktor | nie (default=0) |

### Widgety i interakcje

| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| (this) | Q3ListBox | -- | highlighted(int) | selection(int) -> emituje changed/cardChanged/portChanged |

Widget jest lista Q3ListBox. Kazdy element listy to opis portu karty dzwiekowej (np. "AES/EBU Input 1", "Line Out 2"). Uzytkownik wybiera element z listy, co emituje sygnaly z numerem karty i portu.

### Elementy listy

Elementy wypelniane dynamicznie w konstruktorze:
- **PlayDevice**: dla kazdej karty (0..cardQuantity), dla kazdego portu wyjsciowego -> insertItem(getOutputPortDescription(card, port))
- **RecordDevice**: dla kazdej karty (0..cardQuantity), dla kazdego portu wejsciowego -> insertItem(getInputPortDescription(card, port))

Indeks elementu = card * HPI_MAX_NODES + port

### Stany widoku

| Stan | Kiedy | Co widzi uzytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Pusty | Brak kart HPI w systemie | Lista pusta, nic do wyboru | -- |
| Wypelniony | Karty HPI wykryte | Lista z opisami portow | -- |

### Walidacje UI

Brak walidacji -- widget emituje sygnaly przy kazdym wyborze bez walidacji.

### Nawigacja

| Skad | Jak | Co przekazuje |
|------|-----|---------------|
| Okno konfiguracji audio (w rdadmin/rdairplay/etc) | Osadzony jako widget | dev_class, RDConfig |

### Rozbieznosci screenshot <-> kod

| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| (brak screenshotow) | -- | -- | Brak screenshotow dla tego widgetu |

### Linux-specific elementy UI

| Element | Powod | Zastapic przez |
|---------|-------|---------------|
| Q3ListBox | Qt3Support deprecated widget | QListWidget lub QListView |

---

## Spot-check

Spot-check wykonany na jedynym widgecie (RDHPISoundSelector):
1. Konstruktor zweryfikowany -- insertItem() generuje elementy listy dynamicznie z RDHPISoundCard
2. connect(this, SIGNAL(highlighted(int)), this, SLOT(selection(int))) -- potwierdzone w kodzie
3. Sygnaly changed/cardChanged/portChanged -- potwierdzone w selection() slot

Wynik: 0 rozbieznosci. PASS.
