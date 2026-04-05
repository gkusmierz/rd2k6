---
phase: 4
artifact: {ARTIFACT_ID}
artifact_name: {pełna nazwa}
status: done
completed_at: ~
partial_count: ~
total_connections: ~
circular_deps_found: 0
agent_version: 1.0.0
---

# Call Graph: {ARTIFACT_NAME}

## Statystyki

| Metryka | Wartość |
|---------|---------|
| Połączenia connect() łącznie | ~ |
| Unikalne sygnały | ~ |
| Klasy emitujące | ~ |
| Klasy odbierające | ~ |
| Cross-artifact połączenia | ~ |
| Circular dependencies | ~ |

---

## Graf połączeń (connect registry)

<!-- Kompletna lista wszystkich connect() w artifakcie -->
<!-- Jeden wiersz per połączenie, posortowane po nadawcy -->

| # | Nadawca (klasa) | Sygnał | Odbiorca (klasa) | Slot | Zdefiniowane w | Warunek |
|---|----------------|--------|-----------------|------|---------------|---------|
| 1 | {NadawcaKlasa} | {sygnał(typy)} | {OdbiorcaKlasa} | {slot(typy)} | {plik.cpp:linia} | {zawsze / przy starcie / etc.} |

---

## Kluczowe przepływy zdarzeń

<!-- Opis najważniejszych łańcuchów sygnałów w języku naturalnym -->
<!-- Jeden przepływ = jeden user action lub system event -->

### Przepływ: {nazwa przepływu, np. "Zapis Cart"}

```
[Użytkownik] kliknięcie "Save"
    → SaveButton::clicked()
    → CartEditDialog::onSaveClicked()
    → emit cartSaveRequested(cart)
    → RDLibrary::onCartSaveRequested(cart)
    → emit cartSaved(cart.id)
    → LibraryModel::onCartSaved(id)  [odświeżenie listy]
```

**Efekt biznesowy:** {co osiąga ten przepływ z perspektywy użytkownika}

---

## Cross-artifact połączenia

<!-- Sygnały/eventy między różnymi artifaktami projektu -->

| Źródło artifact | Mechanizm | Cel artifact | Sygnał/Metoda | Znaczenie |
|----------------|-----------|-------------|--------------|-----------|
| {ARTIFACT_A} | D-Bus / QSharedMem / TCP | {ARTIFACT_B} | {metoda} | {efekt biznesowy} |

---

## Q_PROPERTY Reactive Bindings

<!-- Properties z NOTIFY — używane przez QML lub zewnętrzne komponenty -->

| Klasa | Property | Typ | NOTIFY sygnał | Kto nasłuchuje |
|-------|----------|-----|--------------|----------------|
| {Klasa} | {property} | {typ} | {sygnał} | {odbiorcy} |

---

## Circular Dependencies

<!-- Jeśli found > 0 — wymaga analizy czy intentional -->

| Cykl | Klasy w cyklu | Prawdopodobnie intentional? | Uwagi |
|------|--------------|---------------------------|-------|

---

## Missing Coverage

<!-- Sygnały z inventory.md bez żadnej krawędzi connect() -->

| Klasa | Sygnał | Prawdopodobne wyjaśnienie |
|-------|--------|--------------------------|
