# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- [global] Added new setting to adjust background color if plain style is selected.

### Changed

- [global] Upgraded to fastify version 5 and updated corresponding dependencies.
- [global] Replaced svelte material ui with carbon components.
- [memorandum] Added context menu for folders.
- [global] Global menu now closes on link click.

### Fixed

- [memorandum] Fixed an issue where editing a folder in memorandum changed the wrong folders settings.

## [1.0.3] - 2025-03-12

### Added
- [food-scan] MVP implementation with web llm and https://ocr.space/OCRAPI.
- [global] Added global theme switch functionality with local storage.
- [global] Light login functionality for every page to make tilloh.dev accessible to invited users.
- [memorandum] Autofocus on link search input field for a better UX.
- [global] Added dockerfiles to run the frontend, backend and database os independent with docker-compose

### Changed
- [global] Refactored css names to snake_case.
- [global] Implemented google material font locally.
- [food-scan] Second increment with follow up questions and camera input for mobile browsers.
- [global] Updated dark theme styling.
- [global] Refactored svelte store usage and corresponding code architecture.
- [settings] Changed the way users activate cloud persistence and updated info texts.
- [global] Refactored the way in which svelte stores are used in the app.

### Fixed
- [global] Language switch support fix for in-app texts.
- [global] Side nav bar css fix.

## [1.0.2] - 2024-12-18

### Added
- [global] Global language switch with local storage support.
- [memorandum] Link search input field with live results.
- [global] Renovate bot support for automating npm package updates.
- [global] Overhauled application appearance and rearranged UI components.
- [global] Unique logo for the project with favicon variants.
- [jokes] Ability to insert new jokes through form input and lookup random jokes by anyone.

### Changed
- [global] Enhanced readme documentation.

### Fixed

## [1.0.1] - 2024-09-01

### Added
- [global] Internalization of static frontend texts with `sveltekit-i18n` library supporting de and en locales.
- [admin] Admin panel for viewing metrics, managing toggles and approve jokes.
- [toggles] Global features toggle management using already existing key-value persistence.
- [backend] Unit tests for core features.

### Changed
- [global] Refactored frontend code architecture to improve readability.
- [uno-sort] Enhanced `uno-sort` component for better user experience.

### Fixed

## [1.0.0] - 2024-06-02

### Added
- [global] Initial project version setup including already existing features like memorandum, uno sort, lists, catch-em-all, settings and about me.
- [global] Automatic ci / cd pipeline with GitHub Actions.
- [global] Git hooks for pre-commit checks and post-commit gitmoji commit messages.

### Changed

### Fixed
