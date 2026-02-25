# WAP – Projekt 1 (students.mjs)

Testováno s Node.js **v22.13.1**

---

## Struktura projektu

Po rozbalení archivu by se měly v kořenovém adresáři nacházet následující soubory:

- `students.mjs` – implementace knihovny (Person / Student / Alumni)
- `tests.mjs` – vlastní testy (node:test)
- `example.mjs` – ukázkový skript pro porovnání výstupu
- `expected.txt` – vzorový výstup pro `example.mjs`
- `test.sh` – skript pro spuštění testů
- `doc.sh` – skript pro generování dokumentace (JSDoc)
- `jsdoc.json` – konfigurační soubor pro JSDoc

---

## Spuštění testů

### 1) Nastavení spustitelnosti (jen jednou)

```bash
chmod +x test.sh doc.sh
```

### 2) Spuštění testů

```bash
./test.sh
```

Skript provede:

- porovnání výstupu `example.mjs` s `expected.txt`
- spuštění vlastních testů (`tests.mjs`)

Pokud je vše správně implementováno, skript skončí bez chyby.

---

## Generování dokumentace

Dokumentace je generována z JSDoc komentářů ve `students.mjs` pomocí konfiguračního souboru `jsdoc.json`.

### Varianta A – bez instalace závislostí (doporučeno)

```bash
./doc.sh
```

Skript použije `npx jsdoc -c jsdoc.json` a vytvoří složku:

```
docs/
```

Dokumentaci otevřete v prohlížeči:

```
docs/index.html
```

---

### Varianta B – instalace JSDoc lokálně

Pokud chcete JSDoc nainstalovat jako dev dependency:

```bash
./doc.sh install
```

Poté dokumentaci vygenerujete:

```bash
./doc.sh
```

---

## Poznámky

- Výstupy jsou porovnávány na přesnou shodu (včetně mezer a koncových znaků řádků).
- Testy jsou implementovány pomocí vestavěného modulu `node:test`.
- Projekt využívá ES moduly (`.mjs`).
- Dokumentace je generována pomocí JSDoc 4.x.
