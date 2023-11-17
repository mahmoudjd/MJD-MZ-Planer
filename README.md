# MJD-MZ-Planer

# Veranstaltungsplanungs-Webanwendung

Diese Webanwendung wurde im Rahmen eines Projekts zur Veranstaltungsplanung entwickelt. Sie ermöglicht die Verwaltung von Gästelisten und die Sitzplatzplanung für Veranstaltungen wie Hochzeiten. Die Anwendung besteht aus einem Node.js-Express-Server, der die notwendigen Ressourcen persistent speichert und über eine REST-konforme HTTP-Schnittstelle zur Verfügung stellt. Die Browser-Anwendung bietet dem Nutzer die folgenden Funktionalitäten:

## Funktionen

- Veranstaltungen anlegen und löschen
- Gäste in die Gästeliste einer Veranstaltung eintragen und löschen
- Einladungsstatus der Gäste verwalten
- Sitzplan einer Veranstaltung erstellen und bearbeiten

## Eigenschaften einer Veranstaltung

- Name
- Datum und Uhrzeit des Veranstaltungsbeginns
- Gästeliste
- Sitzplan

## Eigenschaften eines Gasts

- Name
- Kind (ja/nein)
- Einladungsstatus (unbekannt, eingeladen, zugesagt, abgesagt)

## Sitzplatzplanung

- Anzahl der rechteckigen Tische
- Anzahl der Sitzplätze pro Tisch
- Einseitige oder zweiseitige Bestuhlung aller Tische

Die Sitzplanparameter können nach Festlegung nicht mehr geändert werden. Personen können erst nach Festlegung der Parameter einem Sitzplatz zugeordnet werden.

## Paginierung

Die Liste der Veranstaltungen wird paginiert, um nur so viele Einträge anzuzeigen, wie in das Browser-Fenster passen. Der Nutzer kann zwischen den Seiten der Listen wechseln, und der aktuelle Seitenindex sowie die Gesamtanzahl der Seiten werden angezeigt. Bei Änderung der Browser-Fenstergröße wird die Liste neu paginiert.

## Technologien und Anforderungen

- Node.js und Express für den HTTP-Server
- MongoDB oder SQLite für die Persistierung der Ressourcen
- Es wird auf JavaScript-Präprozessoren und MV\*-Frameworks verzichtet
- Kein Einsatz von jQuery
- Esbuild für den Build-Prozess
- semistandard-Regeln für fehlerfreien Code
- Funktional in Google Chrome und Mozilla Firefox

## Installation und Start

Zur erstmaligen Ausführung der Anwendung:

```bash
npm install && npm run build && npm start

```

