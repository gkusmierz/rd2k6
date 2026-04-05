# PHASE-QA-FIX — Autonomous Fix Agent
## Wersja: 1.0.0 | Faza: po QA-verify | Scope: per artifact + per phase

---

## Krok 0: Bootstrap Serena MCP (OBOWIĄZKOWY)

**Wykonaj PRZED jakąkolwiek pracą z kodem:**
1. `ToolSearch(query="+serena", max_results=50)` — pobierze definicje narzędzi Serena MCP
2. Wywołaj `mcp__serena__initial_instructions()` — inicjalizacja Sereny
3. Dopiero potem kontynuuj normalną pracę

> ⚠️ Bez tego kroku narzędzia Serena NIE BĘDĄ DOSTĘPNE — są to deferred tools wymagające jawnego pobrania.

---

## Cel

Autonomiczna naprawa outputów faz na podstawie BUG entries z changelog.
Agent czyta changelog → naprawia pliki analizy → loguje FIX entries.

**NIE naprawia kodu źródłowego** — naprawia tylko pliki `.analysis/`.

---

## Parametry wejściowe

```
ARTIFACT_ID:  identyfikator artifaktu (np. LIB)
PHASE:        numer fazy do naprawy (1-7)

Opcjonalne (manual bug report):
  BUG_DESCRIPTION: opis problemu zgłoszony przez użytkownika (free text)
```

> Jeśli podano BUG_DESCRIPTION → agent NAJPIERW loguje ręczny bug do changelog,
> a POTEM naprawia go razem z innymi open bugs.

---

## Krok 0.5 — Obsługa ręcznego zgłoszenia (jeśli BUG_DESCRIPTION podany)

Jeśli użytkownik podał BUG_DESCRIPTION:

1. **Zrozum zgłoszenie** — przeanalizuj opis, ustal:
   - Której sekcji/elementu dotyczy
   - Jaki plik analizy wymaga poprawy
   - Jakie jest oczekiwane zachowanie

2. **Zweryfikuj z kodem źródłowym** — nie ufaj ślepo zgłoszeniu:
   ```
   Serena: search_for_pattern / find_symbol
   → Potwierdź że problem faktycznie istnieje
   → Ustal severity na podstawie wpływu
   ```

3. **Zaloguj jako BUG w changelog** z prefixem `MANUAL`:
   ```markdown
   ### BUG-P{PHASE}-{NR} | {SEVERITY} | open | MANUAL

   - **Kontrola:** MANUAL (zgłoszenie użytkownika)
   - **Cykl:** manual
   - **Data:** {YYYY-MM-DD}
   - **Severity:** {ustalony na podstawie analizy}
   - **Status:** open
   - **Zgłoszenie:** {BUG_DESCRIPTION — dokładny tekst użytkownika}
   - **Opis:** {sformalizowany opis po weryfikacji z kodem}
   - **Dowód:** {plik:linia potwierdzający problem}
   - **Oczekiwany stan:** {co powinno być}
   - **Plik do poprawy:** {ścieżka}
   - **Sekcja do poprawy:** {sekcja}
   ```

4. Kontynuuj do Kroku 1 — bug trafi do puli open bugs i zostanie naprawiony.

---

## Krok 1 — Wczytaj changelog i zidentyfikuj bugs do naprawy

```
Read: .analysis/{ARTIFACT_ID}/_qa/changelog.md
→ Znajdź sekcję "## Phase {PHASE}"
→ Wyfiltruj wpisy BUG ze statusem: open lub reopened (w tym MANUAL)
→ Posortuj po severity: CRITICAL → HIGH → MEDIUM → LOW
```

Jeśli brak open bugs → zakończ: "Brak otwartych bugów do naprawy."

---

## Krok 2 — Dla każdego BUG (od najwyższego severity)

### 2a — Zrozum problem

Z wpisu BUG wyciągnij:
```
BUG_ID:          np. BUG-P3-004
KONTROLA:        np. CTRL-3.3
SEVERITY:        np. HIGH
OPIS:            co jest nie tak
DOWOD:           plik:linia lub opis rozbieżności
OCZEKIWANY_STAN: co powinno być
PLIK_DO_POPRAWY: ścieżka do pliku analizy
SEKCJA:          która sekcja w pliku
```

### 2b — Pozyskaj prawidłowe dane z kodu

> Agent MUSI pobrać prawdziwe dane z kodu źródłowego.
> NIGDY nie "zgaduje" poprawek — zawsze weryfikuje z kodem.

**Strategia per typ bugu:**

**BUG: Brakujący element (klasa/sygnał/dialog/widget)**
```
Serena: find_symbol(name_path_pattern="{BRAKUJACY_ELEMENT}")
Serena: get_symbols_overview(relative_path="{HEADER}")
→ Pozyskaj pełne dane o brakującym elemencie
→ Sformatuj zgodnie z szablonem sekcji
```

**BUG: Błędna informacja (zły typ socketu, fałszywa walidacja)**
```
Serena: find_symbol(name_path_pattern="{METODA}", include_body=true)
→ Przeczytaj faktyczną implementację
→ Wyciągnij prawidłowe dane
→ Zastąp błędną informację prawidłową
```

**BUG: Brakujące source reference (facts bez plik:linia)**
```
Serena: search_for_pattern(substring_pattern="{WZORZEC_Z_REGULY}")
→ Znajdź gdzie w kodzie jest implementacja reguły
→ Dodaj source reference do reguły Gherkin
```

**BUG: Niespójność między fazami (inventory ≠ call-graph)**
```
Read: .analysis/{ARTIFACT_ID}/{PLIK_FAZY_A}
Read: .analysis/{ARTIFACT_ID}/{PLIK_FAZY_B}
→ Ustal która wersja jest prawidłowa (weryfikacja z kodem)
→ Popraw plik który ma błędną informację
```

### 2c — Zastosuj poprawkę

```
Edit: .analysis/{ARTIFACT_ID}/{PLIK_DO_POPRAWY}
→ Zastąp błędną sekcję prawidłową
→ Zachowaj formatowanie i strukturę dokumentu
```

### 2d — Zaloguj FIX w changelog

Bezpośrednio pod odpowiednim wpisem BUG dodaj wpis FIX:

```markdown
#### FIX for BUG-P{PHASE}-{NR}

- **Data:** {YYYY-MM-DD}
- **Cykl:** fix po cycle {C}
- **Akcja:** {co zostało zmienione}
- **Plik:** {który plik zmodyfikowano}
- **Dowód poprawki:** {plik:linia lub opis co jest teraz}
- **Weryfikacja:** {jak sprawdzono że poprawka jest prawidłowa}
```

Zmień status BUG na `fixed`:
```
### BUG-P{PHASE}-{NR} | {SEVERITY} | ~~open~~ fixed
```

---

## Krok 3 — Podsumowanie napraw

Po przetworzeniu wszystkich bugów:

```
FIXED:    lista BUG-ID które naprawiono
SKIPPED:  lista BUG-ID których NIE dało się naprawić autonomicznie
  → Powód: {np. "wymaga ludzkiej decyzji", "brak jednoznacznych danych w kodzie"}
```

### Reguły bezpieczeństwa

> **NIGDY nie fabricuj danych.** Jeśli nie możesz znaleźć prawidłowej informacji
> w kodzie źródłowym — nie wymyślaj jej. Zamiast tego:
> 1. Oznacz BUG jako `needs_human_review`
> 2. Dodaj komentarz wyjaśniający co próbowałeś i czego nie znalazłeś

> **NIGDY nie usuwaj sekcji.** Jeśli sekcja ma błędne dane — popraw je.
> Jeśli sekcja nie powinna istnieć — dodaj komentarz `<!-- REMOVED: powód -->`

> **Zachowaj spójność z resztą dokumentu.** Poprawka nie może złamać
> formatowania ani referencji wewnętrznych.

---

## Krok 4 — Zaktualizuj tabelę podsumowania w changelog

```
→ Przelicz: total_fixes, open_critical, open_high, open_medium, open_low
→ Zaktualizuj status fazy
→ Jeśli zero open CRIT/HIGH → status = stable
→ Jeśli zero open → status = clean
```

---

## Krok 5 — Raport końcowy

Wyświetl:
```
QA-FIX Phase {N} — {ARTIFACT_ID}
Fixed: {N} bugs
Skipped: {M} bugs (needs human review)
Remaining open: {CRIT} critical, {HIGH} high, {MED} medium, {LOW} low

Następny krok:
  → /qtre-qa {ARTIFACT_ID} {PHASE}   (re-weryfikacja)
```

---

## Typy napraw per faza

### Phase 1 fixes — Discovery State
| Typ BUG | Strategia naprawy |
|---------|-------------------|
| Błędna liczba plików | Przelicz przez Serena find_file |
| Brakująca klasa w liście | Dodaj wpis na podstawie get_symbols_overview |
| Błędny entry point | Popraw na podstawie search_for_pattern("main") |

### Phase 2 fixes — Inventory
| Typ BUG | Strategia naprawy |
|---------|-------------------|
| Brakująca klasa | Uruchom mini-inventory dla tej klasy (jak sub-agent Phase 2) |
| Brakujące sygnały | Wyciągnij z headera i dodaj do sekcji |
| Błędny typ komunikacji | Sprawdź socket type w kodzie, popraw opis |
| Brakująca sekcja Linux-specific | Szukaj wzorców platform-specific w source |

### Phase 3 fixes — UI Contracts
| Typ BUG | Strategia naprawy |
|---------|-------------------|
| Brakujący dialog | Przeczytaj konstruktor, wygeneruj UI Contract z kodu |
| Fałszywa walidacja | Usuń walidację której nie ma w kodzie |
| Brakujące widgety | Przeczytaj konstruktor, dodaj brakujące |
| Błędny tytuł okna | Sprawdź setWindowTitle() w kodzie, popraw |
| Brak mockupu | needs_human_review (wymaga screenshota) |

### Phase 4 fixes — Call Graph
| Typ BUG | Strategia naprawy |
|---------|-------------------|
| Brakujące sygnały w grafie | Dodaj z headera + znajdź connect() |
| Błędny typ socketu | Sprawdź w kodzie, popraw opis |
| Brakujące connect() | Szukaj connect() w source, dodaj krawędź |

### Phase 5 fixes — Facts
| Typ BUG | Strategia naprawy |
|---------|-------------------|
| Brak source reference | Szukaj implementacji w kodzie, dodaj plik:linia |
| Błędna reguła Gherkin | Przeczytaj kod, przepisz regułę |
| Brakujący limit/stała | Szukaj #define/const w kodzie, dodaj |

### Phase 6 fixes — SPEC
| Typ BUG | Strategia naprawy |
|---------|-------------------|
| Pusta sekcja | Wygeneruj z danych faz 2-5 |
| Platform leak (JACK w Sekcji 3) | Przenieś do Sekcji 11, w Sekcji 3 użyj opisu generycznego |
| Niespójność encji | Synchronizuj z inventory.md |

### Phase 7 fixes — Features
| Typ BUG | Strategia naprawy |
|---------|-------------------|
| Brakujący use case | Przypisz do istniejącego FEAT lub utwórz nowy |
| Cykl w depends_on | needs_human_review |
| Pusty IN/OUT SCOPE | Wygeneruj z use cases i reguł FEAT |

---

## Warunek done

```
Wszystkie open bugs z severity CRITICAL i HIGH:
  → status = fixed LUB needs_human_review
Changelog zaktualizowany (FIX entries dodane)
Tabela podsumowania przeliczona
```
