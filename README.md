# BuildingManager

Przeglądarkowa aplikacja do śledzenia stanu uruchomienia instalacji BMS:
co jest opisane, zaprogramowane, zamontowane, podłączone i sprawdzone.

To repozytorium zawiera **samą skorupę aplikacji — bez żadnych danych
o obiektach**. Listę urządzeń i stan obiektu aplikacja pobiera z osobnego,
prywatnego repozytorium przez API GitHuba, po podaniu tokenu dostępu.
Token zostaje w pamięci przeglądarki na danym urządzeniu i jest wysyłany
wyłącznie do `api.github.com`.

Pliki są generowane — nie edytować ich tutaj. Źródłem są `aplikacja/szablon.html`
i `aplikacja/generuj.py` w repozytorium projektu.
