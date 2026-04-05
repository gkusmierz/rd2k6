Sprawdź status projektu reverse engineering.

1. Znajdź manifest projektu: `.analysis/*.manifest.md`
2. Jeśli manifest nie istnieje, powiedz użytkownikowi że projekt nie został jeszcze zainicjalizowany (uruchom `/qtre-prereq-check` a potem `/qtre-phase-0-discovery`).
3. Jeśli manifest istnieje:
   - Wyświetl listę wszystkich artifaktów z ich statusami faz (0-7)
   - Wskaż który artifact i która faza jest następna do wykonania
   - Pokaż dependency graph (które artifakty blokują inne)
4. Sprawdź frontmatter statusów w plikach `.analysis/**/*.md` i porównaj z manifestem.
5. Wyświetl podsumowanie w formie tabeli.
