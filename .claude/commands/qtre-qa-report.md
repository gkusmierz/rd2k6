Zgłoś ręcznie problem w analizie artefaktu i uruchom naprawę.

## Parametry

Argument: `ARTIFACT_ID PHASE_NUMBER opis problemu...`
Przykład: `/qtre-qa-report LIB 3 Dialog RDAddCart ma fałszywą walidację "You must select a group!" — takiej nie ma w kodzie`
Przykład: `/qtre-qa-report LIB 2 RDCae opisany jako UDP socket, a faktycznie primary to TCP`
Przykład: `/qtre-qa-report LIB 3 Brakuje UI contractu dla RDListGroups`

## Instrukcje

1. Parsuj argumenty:
   - `ARTIFACT_ID` = pierwszy argument (np. LIB)
   - `PHASE` = drugi argument (np. 3)
   - `BUG_DESCRIPTION` = reszta argumentów (opis problemu)

2. Wczytaj definicję agenta: `.claude/agents/PHASE-QA-fix.md`

3. Uruchom agenta z parametrami:
   - `ARTIFACT_ID`, `PHASE`, `BUG_DESCRIPTION`
   - Agent zweryfikuje zgłoszenie z kodem, zaloguje BUG w changelog, i naprawi

4. Wyświetl:
   - Co zostało zweryfikowane
   - Jaki BUG ID przypisano
   - Co naprawiono (lub dlaczego nie)

## Uwagi

- Agent ZAWSZE weryfikuje zgłoszenie z kodem — nie przyjmuje bezkrytycznie
- Jeśli zgłoszenie okaże się nieuzasadnione → loguje jako `rejected` z wyjaśnieniem
- Opis problemu może być w dowolnej formie — agent sformalizuje go do formatu BUG
- Po naprawie możesz uruchomić `/qtre-qa ARTIFACT_ID PHASE` żeby zweryfikować
