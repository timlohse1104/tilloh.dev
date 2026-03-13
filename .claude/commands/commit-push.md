Führe einen vollständigen Commit-und-Push-Workflow durch. Falls `$ARGUMENTS` übergeben wurde, verwende es als Commit-Nachricht. Andernfalls leite eine kurze Nachricht (max. 1 Satz) aus den Änderungen ab.

## Schritte

### 1. Status analysieren
Führe folgende Befehle parallel aus:
- `git status` — zeigt untracked und geänderte Dateien
- `git diff` — zeigt staged und unstaged Änderungen
- `git log --oneline -5` — zeigt die letzten 5 Commits für Stil-Konsistenz

### 2. CHANGELOG.md prüfen und aktualisieren
Prüfe, ob CHANGELOG.md bereits geändert wurde (`git status`). Falls **nicht**:
- Analysiere die Änderungen und erstelle passende Einträge unter `## [Unreleased]`
- Nutze das bestehende Format: `### Added / Changed / Fixed / Removed` mit `[modul]`-Prefix
- Beispiel: `- [memorandum] Neue Funktion XY hinzugefügt.`

### 3. Dateien stagen
Stage alle relevanten Dateien **gezielt per Name** (kein `git add -A` oder `git add .`):
- Starte mit allen geänderten Dateien aus `git status`
- Stege immer auch CHANGELOG.md mit
- Vermeide versehentliches Stagen von: `.env`, Credential-Dateien, Binaries, `node_modules/`

### 4. Commit erstellen
- Falls `$ARGUMENTS` übergeben: verwende exakt diesen Text als Commit-Nachricht
- Sonst: leite einen prägnanten Satz aus den Änderungen ab (Imperativ, Englisch, max. 1 Satz)
- **Kein Gitmoji** in der Nachricht — der Post-Commit Hook fügt es automatisch hinzu
- Erstelle den Commit im HEREDOC-Format mit Co-Authored-By-Zeile:

```
git commit -m "$(cat <<'EOF'
Commit-Nachricht hier.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

### 5. Push
- Prüfe ob der aktuelle Branch einen Upstream-Tracking hat
- Falls ja: `git push`
- Falls kein Upstream: `git push -u origin <branch-name>`

### 6. Bestätigung
- Führe `git status` aus
- Gib eine kurze Zusammenfassung aus: Commit-Hash, Nachricht, gepushter Branch

## Wichtige Regeln

- **Niemals** `.env`, Credential-Dateien oder Secrets committen
- **Kein** `--no-verify` oder `--force`
- **Kein** `git add -A` oder `git add .`
- Bei Pre-Commit-Hook-Fehler: Problem beheben, dann **neuen** Commit erstellen (kein `--amend`)
- Commit-Nachricht: **maximal 1 Satz**, Imperativ, Englisch
- Immer CHANGELOG.md mit aktualisieren, falls nicht bereits geändert
