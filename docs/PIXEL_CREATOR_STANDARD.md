# Standard projektowania wzorów pod kreator Pikseluj

## Zasada podstawowa
Zwierzątko projektujemy **jednocześnie jako obraz i edytowalną postać**. Każdy wzór ma natywną tablicę kolorów i z góry określone strefy zmian, zanim trafia do aplikacji.

- Poziomy: 16×16, 24×24, 32×40, 40×56. Każda komórka reprezentuje dokładnie jedną pełną kratkę.
- Palety kredek mają celowo mało kolorów: łatwy maksymalnie 5, średni 6, trudny 8, ekspert 10.
- Wzór bazowy nie zawiera *zewnętrznych* dekoracji tła. Scena `none` zawsze pokazuje czystą postać.
- Oczy, usta i dodatki muszą mieć osobne kotwice/strefy edycji **dla każdego poziomu trudności**.
- Zmiana oka najpierw usuwa cały poprzedni wariant w obrębie maski, a potem rysuje nowy. Mruganie: jedno oko naprawdę zamknięte — bez widocznej źrenicy.
- Kokarda, korona, kwiatek, gwiazdka czy szalik muszą być osadzone **na postaci** (ucho, kapelusz, szyja), nie w przypadkowym miejscu planszy.
- Dekoracje wokół postaci są osobną warstwą, rysowaną tylko na pustych polach, dopiero po wybraniu opcji.
- Renderowanie jest bezstanowe: `render(level, options)` zawsze zaczyna od niezmiennej bazy. Cofnięcie zmiany przywraca ją dokładnie, bez śladów wcześniejszej opcji.
- Kolor futra zmienia tylko futro, nie kontury, źrenice, podkład czy dekoracje.
- Jeżeli dana opcja nie daje **widocznego** efektu na określonym poziomie, popraw wzór albo ukryj tę opcję. Nie zostawiaj martwych przycisków.

## Obowiązkowe testy przed wdrożeniem

1. Prawidłowe rozmiary i znane kody kolorów wszystkich wierszy.
2. Wszystkie warianty oczu, minek, dodatków, tła i kolorów mają różne wyniki dla każdego poziomu.
3. Zamknięte oko nie pozostawia otwartej źrenicy.
4. Bez dekoracji: zerowa liczba elementów tła; ozdoby tła są dodawane tylko na pustych kratkach.
5. Po dowolnej serii zmian powrót do ustawień bazowych daje identyczny obraz.
6. Żadna kombinacja nie przekracza limitu kredek.
7. Ocena na telefonie: podgląd widoczny podczas przewijania ustawień; sprawdzić realnie kliknięcia na urządzeniu.

**Uwaga:** same testy tablic pikseli nie są pełnym testem wyglądu na telefonie. Dla nowej postaci wymagany jest też przegląd wizualny wszystkich wariantów.
