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

### 1) Nastavení spustitelnosti

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

---

## Generování dokumentace

Dokumentace je generována z JSDoc komentářů ve `students.mjs` pomocí konfiguračního souboru `jsdoc.json`.

### Varianta A – bez instalace závislostí

```bash
./doc.sh
```

Skript použije `npx jsdoc -c jsdoc.json` a vytvoří složku:

```
docs/
```

---

### Varianta B – instalace JSDoc lokálně

Pokud chcete JSDoc nainstalovat lokálně jako dev dependency:

```bash
./doc.sh install
```

Poté dokumentaci vygenerujete obdobně jako u varianty A:

```bash
./doc.sh
```

---

Dokumentaci můžete otevřít v prohlížeči:

```
docs/index.html
```
