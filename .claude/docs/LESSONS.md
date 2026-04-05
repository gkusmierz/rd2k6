# LESSONS.md — Lessons Learned
## Qt Reverse Engineering Multi-Agent System

Format: append-only. Każda lekcja ma projekt, odkrycie i wpływ na agentów.
Agent MUSI przeczytać ten plik przed analizą nowego projektu.

---

## Jak czytać ten plik

Każda lekcja to wiedza zdobyta boleśnie podczas realnej analizy.
Zanim zaczniesz analizę nowego projektu Qt — przeczytaj wszystkie lekcje
i sprawdź czy Twój projekt może mieć te same pułapki.

---

## Lekcje — v1.0.0

*Brak lekcji w wersji 1.0.0 — system właśnie uruchomiony.*
*Pierwsze lekcje pojawią się po zakończeniu analizy Rivendell.*

---

## Szablon nowej lekcji

```markdown
## LESSON-{NNN} — {Krótki tytuł}

Data:     YYYY-MM-DD
Projekt:  {nazwa projektu}
Faza:     {której fazy dotyczy}
Odkryte przez: {kto/co odkryło problem}

### Problem
Co poszło nie tak lub co było zaskakujące.

### Dlaczego to się wydarzyło
Przyczyna — w systemie agentów lub w projekcie.

### Rozwiązanie
Co zrobiliśmy żeby to naprawić.

### Wpływ na agentów
Które pliki agentów należy zaktualizować i jak.
Status: pending-update | implemented-in-v{X.Y.Z}
```

---

## Planowane obszary obserwacji podczas Rivendell

Poniższe obszary są potencjalnie trudne — będziemy monitorować:

1. **moc-generated code** — Qt Meta-Object Compiler generuje kod który
   clangd może interpretować inaczej niż IDE. Sprawdź czy find_referencing_symbols
   działa poprawnie dla klas z Q_OBJECT.

2. **Stary styl connect()** — Rivendell może używać Qt4-style connect:
   `SIGNAL(clicked())` zamiast `&QPushButton::clicked`. Serena może
   tego nie złapać przez find_referencing_symbols — potrzebny search_for_pattern.

3. **SQL jako reguły biznesowe** — QSqlQuery z hardcodowanym SQL
   zawiera reguły biznesowe które wyglądają jak kod. Facts Mining musi
   parsować SQL wewnątrz C++.

4. **D-Bus interfaces** — Rivendell używa D-Bus do IPC między aplikacjami.
   To jest cross-artifact communication — call-graph musi to odzwierciedlać.

5. **Pliki .rd i .conf** — Rivendell ma własne formaty plików konfiguracyjnych.
   Faza 5 musi je traktować jako część specyfikacji, nie implementacji.
