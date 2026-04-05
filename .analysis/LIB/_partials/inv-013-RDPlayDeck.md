# inv-013 | RDPlayDeck

## Identyfikacja
- **Klasa:** RDPlayDeck
- **Plik H:** lib/rdplay_deck.h
- **Plik CPP:** lib/rdplay_deck.cpp
- **Bazowa:** QObject
- **Rola:** Abstrakcja pojedynczego decka odtwarzania audio. Zarządza cyklem życia odtwarzania jednego pliku dźwiękowego: load, play, pause, stop, z pełnym systemem timerów dla segue, hook, talk, fade i duck.

## Stałe (defines)
| Stała | Wartość | Znaczenie |
|-------|---------|-----------|
| POSITION_INTERVAL | 100 | Interwał (ms) odświeżania pozycji playback |
| RDPLAYDECK_AUDITION_ID | 2147483647 | Specjalne ID dla trybu audition (odsłuch) |
| RDPLAYDECK_DUCKDOWN_LENGTH | 750 | Domyślny czas (ms) ściszania duck-down |
| RDPLAYDECK_DUCKUP_LENGTH | 1500 | Domyślny czas (ms) przywracania głośności duck-up |

## Enum: State
| Wartość | Opis |
|---------|------|
| Stopped (0) | Deck jest zatrzymany, brak odtwarzania |
| Stopping (1) | Trwa proces zatrzymywania (fade-out w toku) |
| Playing (2) | Aktywne odtwarzanie audio |
| Paused (3) | Odtwarzanie wstrzymane, może być wznowione |
| Finished (4) | Odtwarzanie zakończone naturalnie (nie przez stop) |

## Enum prywatny: Point
| Wartość | Opis |
|---------|------|
| Segue (0) | Punkt segue (przejście między elementami) |
| Hook (1) | Punkt hook (fragment demonstracyjny) |
| Talk (2) | Punkt talk (sekcja do mówienia prezentera) |
| SizeOf (3) | Liczba typów punktów (sentinel) |

## Sygnały
| Sygnał | Parametry | Opis |
|--------|-----------|------|
| stateChanged | int id, RDPlayDeck::State | Emitowany przy każdej zmianie stanu decka |
| position | int id, int msecs | Emitowany co POSITION_INTERVAL ms z aktualną pozycją odtwarzania |
| segueStart | int id | Emitowany gdy playback osiąga punkt rozpoczęcia segue |
| segueEnd | int id | Emitowany gdy playback osiąga punkt końca segue |
| hookStart | int id | Emitowany gdy playback osiąga punkt rozpoczęcia hook |
| hookEnd | int id | Emitowany gdy playback osiąga punkt końca hook |
| talkStart | int id | Emitowany gdy playback osiąga punkt rozpoczęcia talk |
| talkEnd | int id | Emitowany gdy playback osiąga punkt końca talk |

## Public Slots
| Slot | Parametry | Opis |
|------|-----------|------|
| play | unsigned pos, int segue_start=-1, int segue_end=-1, int duck_up_end=0 | Rozpoczyna odtwarzanie od podanej pozycji. Opcjonalnie nadpisuje punkty segue. duck_up_end=-1 oznacza ducking do końca (voice tracker). |
| playHook | (brak) | Rozpoczyna odtwarzanie od punktu Hook start |
| pause | (brak) | Wstrzymuje odtwarzanie; CAE stopPlay + przejście do Paused |
| stop | (brak) | Natychmiastowe zatrzymanie odtwarzania |
| stop | int interval, int gain=-10000 | Zatrzymanie z fade-out: duck-down jeśli możliwy, potem segue fade, stop timer |
| duckDown | int interval | Ścisza deck o duck_gain[1] z animacją duck_down ms |
| duckVolume | int level, int fade | Ustawia dodatkowy poziom duck i aplikuje fade w runtime |

## Metody publiczne
| Metoda | Zwraca | Opis |
|--------|--------|------|
| id() const | int | Identyfikator decka |
| setId(int) | void | Ustawia identyfikator decka |
| owner() const | int | ID właściciela (-1 = brak) |
| setOwner(int) | void | Ustawia właściciela |
| cart() const | RDCart* | Bieżący cart załadowany na decku |
| setCart(RDLogLine*, bool rotate) | bool | Ładuje cart z RDLogLine. Tworzy RDCart i RDCut, wylicza punkty audio/segue/hook/talk/fade/duck, ładuje plik w CAE. Zwraca false jeśli cart/cut nie istnieje lub loadPlay się nie powiedzie. |
| cut() const | RDCut* | Bieżący cut |
| playable() const | bool | Czy deck ma załadowany cut gotowy do odtwarzania |
| card() const | int | Numer karty dźwiękowej |
| setCard(int) | void | Ustawia kartę dźwiękową |
| stream() const | int | Numer strumienia (przydzielany przez CAE przy loadPlay) |
| port() const | int | Numer portu wyjściowego |
| setPort(int) | void | Ustawia port wyjściowy |
| channel() const | int | Numer kanału |
| setChannel(int) | void | Ustawia kanał |
| state() const | State | Bieżący stan decka |
| startTime() const | QTime | Czas rozpoczęcia odtwarzania (wall-clock) |
| currentPosition() const | int | Bieżąca pozycja w ms od początku audio |
| lastStartPosition() const | int | Pozycja z ostatniego wywołania play() |
| clear() | void | Zatrzymuje odtwarzanie i zwalnia zasoby (stop jeśli Playing, unload jeśli Paused) |
| reset() | void | Wymuszony reset: stopPlay + unloadPlay bez emisji stateChanged, przejście do Stopped |

## Zależności
| Klasa | Relacja | Opis |
|-------|---------|------|
| RDCae | agregacja (wskaźnik z zewnątrz) | Core Audio Engine - deck deleguje operacje audio (loadPlay, play, stopPlay, unloadPlay, positionPlay, setOutputVolume, fadeOutputVolume, setPlayPortActive) |
| RDCart | własność (tworzony w setCart) | Reprezentacja cartu radiowego; tworzony z numeru cartu z RDLogLine |
| RDCut | własność (tworzony w setCart) | Reprezentacja cuta; dostarcza punkty audio (start/end/segue/hook/talk/fade) |
| RDLogLine | parametr (setCart) | Linia logu dostarczająca dane konfiguracyjne: numer cartu, nazwa cuta, punkty, fade, duck, timescale |
| QSignalMapper | własność (wewnętrzna) | Mapuje 3 point timery (Segue/Hook/Talk) na jeden slot pointTimerData(int) |

## Kluczowe zachowania

### Cykl życia odtwarzania
1. **setCart()** - ładuje cart i cut z RDLogLine, wylicza wszystkie punkty czasowe (audio, segue, hook, talk, fade, duck), oblicza timescale speed jeśli aktywny, wywołuje CAE loadPlay
2. **play()** - ustawia pozycję w CAE, konfiguruje głośność portu (mute na wszystkich portach, potem ustawia docelowy), obsługuje interpolację fade up/down w toku, wywołuje CAE play z timescale, startuje timery
3. **playingData()** (callback z CAE) - startuje position timer, emituje stateChanged(Playing)
4. **positionTimerData()** - co 100ms oblicza pozycję z wall-clock (obsługa midnight crossing), emituje position(); w hook mode koryguje pozycję
5. **stop()** / **stop(interval, gain)** - natychmiastowy lub z fade-out; wersja z intervalem obsługuje duck-down przed fade
6. **playStoppedData()** (callback z CAE) - rozróżnia pause vs stop vs natural finish, emituje odpowiedni State
7. **clear()** - bezpieczne zatrzymanie z uwzględnieniem stanu

### System timerów (StartTimers)
- **3 point timery** (Segue, Hook, Talk): jednokrotne, uruchamiane z offsetem od początku audio; pointTimerData emituje pary sygnałów start/end
- **Fade timer**: uruchamiany na fadedownPoint; fadeTimerData wyzwala fade-down na porcie
- **Duck timer**: uruchamiany na duck_up_point; duckTimerData przywraca głośność (duck-up) lub kontynuuje fade po duck-down
- **Stop timer**: jednokrotny, wymusza stop() po intervale
- **Position timer**: cykliczny co 100ms, raportuje pozycję

### Timescale
- Aktywowany przez RDLogLine; oblicza prędkość jako stosunek rzeczywistej długości audio do wymuszonej
- Ograniczony do zakresu RD_TIMESCALE_MIN..RD_TIMESCALE_MAX; poza zakresem wyłączany
- Wpływa na obliczenia punktów Talk i czas trwania play()

### Ducking
- Dwa kierunki: duck-down (ściszenie o duck_gain[1] w czasie duck_down ms) i duck-up (przywrócenie w duck_up ms)
- duck_up_end=-1 w play() oznacza ducking do końca (tryb voice tracker)
- duckVolume() pozwala na zewnętrzne ustawienie dodatkowego poziomu duck w runtime
- Duck i fade współdziałają: fade-down nie jest aplikowany gdy duck-down aktywny

## SQL
Brak bezpośrednich zapytań SQL. Dane pochodzą z RDLogLine, RDCart i RDCut, które same zarządzają dostępem do bazy.

## Linux-specific
- Komunikacja audio przez RDCae (abstrakcja CAE daemon, lokalny lub zdalny)
- Brak bezpośrednich wywołań POSIX/Linux w tej klasie
