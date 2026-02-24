# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- [todo] Added shared todo list functionality enabling collaborative editing via unique shared IDs.
- [todo] Added API module (`todo.api.ts`) for shared list operations following project patterns.
- [todo] Added "Make local" button to convert shared lists back to local-only mode.
- [todo] Added conflict resolution notifications when shared list is updated by another user.
- [todo] Added duplicate detection when importing already-imported shared lists.
- [todo] Added error notifications for failed shared list imports with localized messages.
- [todo] Added confirmation modal before deleting todo lists with separate warnings for local vs shared lists.
- [todo] Added server-side deletion for shared lists - when a shared list is deleted, it's removed from the backend.
- [todo] Added cross-user deletion detection - automatically removes shared lists from all users when deleted by another user.
- [todo] Added notification when a shared list is deleted by another user, with automatic list selection fallback.
- [memorandum] Added "Copy link URL" option to link context menu for easy URL copying to clipboard.
- [memorandum] Added arrow-based reordering system with up/down buttons and "Move to Top/Bottom" context menu options for folders and links.
- [memorandum] Added editable preset overlay with JSON validation, allowing direct editing of preset configuration with real-time validation and sync to localStorage/cloud.
- [global] Added new setting to adjust background color if plain style is selected.

### Changed

- [todo] Replaced hardcoded "Uncategorized" category string with empty string throughout codebase - UI displays localized "General" / "Allgemein" label.
- [todo] Improved shared ID copy UI: icon-only button integrated with input field, success notification displayed at bottom of modal.
- [todo] Changed default view to category view (was: classic view) for better organization of todos.
- [todo] Added persistence for last viewed todo list - page reload now returns to the previously viewed list.
- [todo] Updated "Uncategorized" category label to more user-friendly "General" (EN) / "Allgemein" (DE).
- [todo] Improved TodoListOverlay modal UX by moving share/unshare button to modal action buttons and styling delete button as danger/red.
- [todo] Refactored shared list sync from push-based to pull-based polling (5-second intervals) for better conflict detection.
- [todo] Enhanced shared list creation to immediately push existing todos to server after creating shared list.
- [todo] Updated shared list endpoints to be public (no authentication required) for GET, POST, PUT, and DELETE operations.
- [todo] Improved sync logic with debounced updates and automatic conflict resolution via server-side version merging.
- [todo] Replaced inline fetch() calls with dedicated API module following project conventions.
- [todo] Updated API functions to return status codes for better error handling and 404 detection.
- [todo] Migrated todo route and all corresponding components (TodoList, TodoInput, Todo, TodoListOverlay, +page) to Svelte 5 runes syntax ($props, $state, $derived, $effect) for improved reactivity and type safety.
- [todo] Enhanced Todo component with improved UI/UX including clickable rows, better visual feedback, and proper accessibility.
- [todo] Improved TodoList with sorted todos (unchecked first), better state management using $derived, and enhanced history management.
- [todo] Enhanced TodoListOverlay with better form handling, proper state management, and automatic list selection after creation.
- [todo] Updated translations for global menu button text to be more descriptive.
- [food-scan] Migrated food-scan route and all corresponding components (FoodScan, ContentOutput, DebugInformation) to Svelte 5 runes syntax ($props, $state, $derived, $effect) for improved reactivity and type safety.
- [uno-sort] Migrated uno-sort route and ToggledApplicationInfo component to Svelte 5 runes syntax ($props, $state, $derived, $effect) for improved reactivity and type safety.
- [settings] Migrated settings route and all corresponding components (+page, SettingsDashboard, OnlinePersistenceCheck, ThemeSwitch, LanguageSwitch, BackgroundSwitch, IdentifierInformation) to Svelte 5 runes syntax ($props, $state, $derived, $effect) for improved reactivity and type safety.
- [home] Migrated home route and all corresponding components (+page, JokeOfTheDay, SearchBar) to Svelte 5 runes syntax ($props, $state, $derived, $effect) for improved reactivity and type safety.
- [jokes] Migrated jokes route and all corresponding components (Jokes, admin/Jokes, admin/jokes/+page) to Svelte 5 runes syntax ($props, $state, $derived, $effect) for improved reactivity and type safety.
- [admin] Migrated admin route and all corresponding components (Identifiers, Jokes, LinkPresets, Toggles, Activities, Dashboard) to Svelte 5 runes syntax ($props, $state, $derived, $effect) for improved reactivity and type safety.
- [admin] Converted event-based communication to callback props pattern for better type safety and maintainability.
- [memorandum] Migrated all memorandum components to Svelte 5 runes syntax ($props, $state, $derived, $effect) for improved reactivity and type safety.
- [frontend] Updated all dependencies to latest versions: Svelte 5.53.0, TypeScript 5.9.3, Vite 7.3.1, ESLint 9.39.3, Vitest 4.0.18, NX 22.5.2, SvelteKit 2.53.0, Carbon Components 0.101.0.
- [global] Upgraded to fastify version 5 and updated corresponding dependencies.
- [global] Replaced svelte material ui with carbon components.
- [memorandum] Added context menu for folders.
- [memorandum] Replaced drag-and-drop with arrow-based reordering for better reliability and mobile support.
- [global] Global menu now closes on link click.

### Removed

- [global] Removed Renovate bot - dependencies will be managed manually going forward.
- [memorandum] Removed drag-and-drop functionality for folders and links.

### Fixed

- [todo] Fixed missing sync when re-adding todos from history - now properly syncs to shared lists.
- [todo] Fixed bi-directional sync issue where changes in one browser didn't appear in other browsers - converted sync setup from onMount to reactive $effect.
- [todo] Fixed Toggle component error by converting `isCategoryView` from derived to state variable, enabling proper two-way binding.
- [todo] Fixed blank display in category view when list has no entries - now shows helpful empty state message.
- [todo] Fixed issue where no list was selected after deleting a list - now automatically selects the first remaining list.
- [todo] Fixed TOCTOU race condition in shared list updates by implementing atomic `findOneAndUpdate` with version check in query filter.
- [todo] Fixed generic error responses by replacing `throw new Error()` with NestJS HTTP exceptions (`NotFoundException`, `ConflictException`).
- [todo] Fixed missing history field persistence by adding to update DTO and MongoDB service signature.
- [todo] Fixed shared list deletion 400 error by removing manual UUID assignment and letting MongoDB auto-generate ObjectIds.
- [todo] Fixed DELETE request 400 error by removing Content-Type header from requests without body.
- [todo] Fixed cross-user deletion detection by adding global polling for all shared lists (every 10 seconds) in addition to per-list polling.
- [todo] Removed duplicate CSS blocks in TodoListOverlay component (`.share_section`, `.shared_id_container`, `.copy_button`, `.copied_notification`).
- [todo] Removed unused `importSharedId` state variable from TodoListOverlay component.
- [todo] Removed unused `selectRandomTagColor` function from TodoList component.
- [global] Fixed erroneous setLocale call in background color store causing i18n warnings.
- [memorandum] Fixed an issue where editing a folder in memorandum changed the wrong folders settings.
- [memorandum] Fixed folder ID duplication issues caused by drag-and-drop.
- [memorandum] Fixed incorrect folder and link positioning when reordering.
- [memorandum] Fixed masonry layout issue where folders stretched to full screen width when search resulted in a single folder.

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
