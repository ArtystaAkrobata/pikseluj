# Pikseluj

Aplikacja webowa do tworzenia pikselowych wzorów i odrysowywania ich w zeszycie w kratkę 5 mm.

## Zasada papieru

**1 piksel wzoru = 1 kratka papieru 5 × 5 mm.** Wymiary wzoru zapisujemy jako szerokość × wysokość w kratkach.

| Kartka | Zalecany maksymalny rozmiar wzoru | Fizyczny rozmiar rysunku |
| --- | --- | --- |
| A6 | 19 × 27 | 9,5 × 13,5 cm |
| A5 | 28 × 40 | 14 × 20 cm |
| A4 | 40 × 56 | 20 × 28 cm |

Wszystkie formaty obsługują obrót: 56 × 40 jest poprawnym wzorem A4 w poziomie. Zalecane granice pozostawiają niewielki margines; zeszyty mogą mieć własne marginesy i mniej dostępnych kratek.

W kodzie: `PAPER_FORMATS`, `paperFits`, `paperRecommended`, `paperDescriptor` w `index.html`.
Nie zwiększać limitów bez jednoczesnego sprawdzenia edytora, zapisu projektów, albumu, czytnika i druku.

## Kreator ręczny

- Własny rozmiar od 5 × 5 do rozmiaru mieszczącego się na A4.
- Presety poziomów 16 × 16, 24 × 24, 32 × 40 i 40 × 56 oraz formaty A6, A5, A4.
- Obracanie wymiarów do układu poziomego.
- Powiększanie i przesuwanie dużej planszy na telefonie.
- Potwierdzenie przed zmianą, która obcina istniejące piksele.
- Projekty i szkice zapisywane w pamięci przeglądarki (`pikseluj/projekty/v1`); istniejące dane zachowują dawny format.

## Magiczne piksele

Pliki: `magic-pixels.js` i `magic-pixels.css`. Moduł nie wymaga serwera generującego obrazki.

- Cztery kategorie: zwierzątka, potworki, roboty, bajkowe światy.
- Cztery poziomy: łatwy 16 × 16, średni 24 × 24, trudny 32 × 40, ekspert 40 × 56.
- Dla większych wzorów tworzone są dodatkowe pikselowe detale i dekoracje.
- Wybór części, wariantów i kolorów, losowanie, cofanie zmian.
- Zapis bezpośrednio do Moich projektów i przenoszenie jako szkicu do ręcznego Kreatora.
- Ochrona przed przypadkowym nadpisaniem istniejącego szkicu.
- Opcje Magicznych pikseli zapisywane w `pikseluj/magiczne/v1`.

Przy zmianie JavaScript/CSS zwiększyć oznaczenie `?v=...` w `index.html`, aby przeglądarki pobrały aktualizację.

## Wzory i album

Galeria, szczegóły wzoru, Moje projekty i Kolekcja informują o rozmiarze, najmniejszym zalecanym formacie kartki i orientacyjnym poziomie trudności. Poziom trudności zależy przede wszystkim od wielkości i liczby użytych kolorów.

Historia postępu i ukończone prace: `pikseluj/zeszyt/v1`. Zachowujemy kompatybilność danych z wcześniejszymi mniejszymi wzorami.

## Zdjęcia ukończonych obrazków

- Po naciśnięciu **✓ Narysowane!** pojawiają się przyciski **📷 Zrób zdjęcie** oraz **🖼️ Wybierz z telefonu**.
- Zdjęcie można dodać później z Kolekcji, zamienić na inne, usunąć niezależnie od wzoru lub obejrzeć w powiększeniu.
- W Kolekcji fotografia rysunku znajduje się obok oryginalnego wzoru pikselowego.
- Fotografie są zmniejszane w przeglądarce do maksymalnie 1600 px dłuższego boku (JPEG, jakość 0,83), aby ograniczyć zużycie miejsca.
- Zapisywane są w lokalnym **IndexedDB** (`pikseluj-zdjecia-albumu-v1`), a nie w `localStorage` z pikselami i nie w chmurze.
- Klucz obrazu to identyfikator wzoru plus jego rewizja, taki sam jak dla ukończonego wpisu.
- Przy usunięciu ukończonej pracy usuwane jest też zdjęcie; dostępne w danej sesji **Cofnij usunięcie** odtwarza oba.
- **Ważne:** usunięcie danych przeglądarki / aplikacji może bezpowrotnie usunąć fotografie. Zdjęcia nie synchronizują się między telefonami. Do trwałej archiwizacji należy zachować kopię w galerii telefonu.
- Pliki: `album-photos.js` i `album-photos.css`. Po zmianach aktualizować wersję `?v=...` w `index.html`.

## Wydruk i PDF

- PDF i druk przeglądarkowy są na A4 w pionie. Każda kratka ma **rzeczywiste 5 mm**, bez skalowania wzoru.
- Szeroki obrazek 56 × 40 obracamy wewnątrz strony A4, zachowując oryginalny układ pikseli.
- Dla większych wzorów kolorowy wzór, pusta kratka i lista kolorów mogą znajdować się na osobnych stronach.
- W drukarce wybrać **skalę 100% / rozmiar rzeczywisty** i wyłączyć „Dopasuj do strony”.
- Nie wszystkie drukarki potrafią drukować przy marginesie 5 mm. Przy pełnym A4 warto sprawdzić obszar drukowania urządzenia.

## Kontrola po aktualizacji

Sprawdzić: uruchomienie na telefonie, otwarcie obu kafelków panelu Kreatora, edytor i jego powiększanie, zapis i edycję dużego wzoru, wznowienie po odświeżeniu, historię i Kolekcję, druk/PDF 40 × 56 i 56 × 40, brak przycinania grafiki oraz rozmiar kratek na wydruku.
