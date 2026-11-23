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

## Magiczne piksele PREMIUM v2

Generator służy do zabawy w tworzenie postaci i scen na papierze w kratkę 5 mm. Nie korzysta z płatnych API ani serwerów generujących obrazy.

**Pliki modułu:**
- `magic-premium-core.js`: pikselowe prymitywy i kompozycje Zwierzątek, Potworków i Robotów
- `magic-premium-worlds.js`: zamki, magiczne lasy, bajkowe domki i latarnie morskie, publiczne API `MagicPremiumArt.render(category,options,level)`
- `magic-pixels.js`: stan, opcje, historia cofania, wybór poziomów, zapis, losowanie, przyciski i podgląd
- `magic-premium-ui.css`: responsywna stylistyka premium, animacje i przyciski
- `magic-pixels.css`: historyczne style (zachowane dla kompatybilności; nowszy CSS ładuje się później)

**Nowa biblioteka Zwierzątek (v3):**
- `magic-curated-data.js`: 16 ręcznie zaprojektowanych bazowych obrazków (lisek, kotek, miś, króliczek × cztery poziomy), zapisanych bezstratnie w krótkich wierszach RLE (para: długość w base36 + znak koloru).
- `magic-curated-animals.js`: dekoder i wyłącznie kontrolowane nakładanie oczu, uśmiechu, ozdób, dodatków oraz zmian koloru; zmiana cech nie rusza bazowej sylwetki.
- `magic-premium-worlds.js`: wybiera bibliotekę kuratorowanych zwierzątek. Pozostałe trzy kategorie nadal działają na poprzednim silniku proceduralnym i wymagają analogicznej oceny artystycznej.
- `magic-jakosc.html`: pomocnicza mobilna galeria 4 × 4 autorskich wzorów, z przełączaniem siatki, dla kontroli jakości na prawdziwym ekranie telefonu.

Zasada rozwoju: **nie traktować poprawności danych jako gwarancji jakości obrazu**. Każdy nowy sprite przed publikacją musi przejść przegląd wizualny 16×16, 24×24, 32×40 i 40×56, w tym kontrolę czytelności sylwetki, konsekwentnych proporcji, ciągłości ciemnego obrysu, skali detali oraz typowego wydruku 5 mm. Nowe style zatwierdzać w galerii jakości.

**Lisek — cztery autorskie poziomy (aktualne wdrożenie):**
- `magic-fox-stages.js` jest **głównym silnikiem** wzorów liska w Magicznych pikselach. Zawiera cztery osobno narysowane siatki i bezstratny dekoder oraz dopuszcza wyłącznie bezpieczną zmianę koloru i dekoracji w pustym tle.
- `magic-premium-worlds.js` kieruje liska do `MagicFoxStages.render()`. Starsze pliki `magic-fox-poses*.js` pozostawiono wyłącznie dla kompatybilności, ale **nie generują już aktualnego liska**.
- Rozmiar i wygląd są nierozerwalnie powiązane: **Łatwy 16×16 — główka**, **Średni 24×24 — mały lisek przodem**, **Trudny 32×40 — pełna postać z dużym ogonem**, **Ekspert 40×56 — profil z motylkiem**.
- Wersje 32×40 i 40×56 są osobnymi rysunkami, bez powiększania 24×24; wszystkie cztery rozmiary mieszczą się na papierze w kratkę 5 mm.
- Dziecko wybiera poziom, kolor i (poza poziomem łatwym) dekoracje. Wybór pozy, oczu, miny i akcesoriów jest **ukryty tylko dla liska**, ponieważ wcześniej prowadził do deformowania sylwetki. Pozostałe zwierzęta zachowują własne opcje.
- „Zaskocz mnie!” losuje tylko kombinacje koloru i ozdób; nie zmienia zwierzęcia, poziomu ani pozy. „Super wersja” przywraca z góry określoną autorską kolorystykę dla danego poziomu.
- Po wyborze liska jego kolor wraca do **naturalnego pomarańczowego**. Istniejące projekty, ręczny Kreator i stan `pikseluj/magiczne/v1` działają tak jak wcześniej.
- `magic-jakosc.html` pokazuje zestawienie nowych czterech etapów liska na prawdziwych siatkach oraz dotychczasowe grafiki innych zwierząt.
- Podgląd i testy w kodzie potwierdzają wymiary i kolory. **To nie zastępuje wizualnej oceny grafiki przez dziecko/rodzica na ekranie telefonu.**

**Zasady jakości grafik:**
- Każdy wzór powstaje bezpośrednio na siatce docelowego rozmiaru: 16 × 16, 24 × 24, 32 × 40 lub 40 × 56.
- **Nie wolno rozciągać gotowego obrazka 24 × 24**, ponieważ deformuje to kontury, uszy i pyszczki.
- Sylwetki i detale są tworzone przez autorskie moduły: połączenia elementów, kontrolowany ciemny kontur, twarze, dodatki, dekoracje i odrębne bajkowe scenerie.
- Spójne piksele i kolory zgodne z ręcznym Kreatorem; bez rozmycia i półpiksela.
- Cztery aktualne etapy liska są narysowane osobno. Pozostałe zwierzęta/krainy mogą korzystać ze starszych metod i wymagają osobnego przeglądu jakości.

**Nowy interfejs:**
- Ekran startowy kategorii z pikselowymi podglądami postaci/scen.
- Duży artystyczny podgląd, bez widocznej kratki na start; przycisk „Pokaż kratki” pokazuje prawdziwą siatkę.
- Cztery czytelne kafelki rozmiarów i poziomów trudności wraz z zalecaną kartką.
- Wybór zwierzaka i dozwolonych cech przez klikalne kafelki; u liska tylko poziom, kolor oraz bezpieczna dekoracja tła. U innych zwierząt nadal dostępne są wybrane oczy, minki i dodatki.
- „🎲 Zaskocz mnie!” losuje wariant, „✨ Super wersja” wybiera z przygotowanych spójnych zestawów, jest też „↶ Cofnij”.
- Możliwość nadania nazwy, zapisu w Moich projektach i przeniesienia do ręcznego Kreatora.
- Ochrona przed przypadkowym nadpisaniem istniejącego szkicu.
- Zgodność ze starszą pamięcią ustawień `pikseluj/magiczne/v1` (nowe pola dostają wartości domyślne).

**Kontrola jakości:**
- Sprawdzić w Chrome/PWA na Androidzie wybór kategorii, klikane cechy i poziomy, „Super wersję”, aparat/galerię (osobna funkcja), cofanie, przewijanie, zapis i ręczną edycję.
- Kontrolować wizualnie przykłady wszystkich czterech poziomów, zwłaszcza wielkość konturów, umieszczenie uszu i oczu oraz czytelność gotowej sceny.
- W testach automatycznych weryfikować wymiar siatki, zgodność kolorów i brak pustych obrazów dla kombinacji opcji.

**Uwaga:** po zmianie plików aktualizować oznaczenie `?v=...` w `index.html`, aby zainstalowane aplikacje pobrały najnowszą wersję.

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
