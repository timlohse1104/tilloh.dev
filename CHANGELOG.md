# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- [food-scan] MVP implementation with web llm and https://ocr.space/OCRAPI.
- [general] Added global theme switch functionality with local storage.

### Changed
- [general] Refactored css names to snake_case.
- [general] Implemented google material font locally.
- [food-scan] Second increment with follow up questions and camera input for mobile browsers.
- [general] Updated dark theme styling.

### Fixed
- [general] Language switch support fix for in-app texts.
- [general] Side nav bar css fix.

## [1.0.2] - 2024-12-18

### Added
- [general] Global language switch with local storage support.
- [memorandum] Link search input field with live results.
- [general] Renovate bot support for automating npm package updates.
- [general] Overhauled application appearance and rearranged UI components.
- [general] Unique logo for the project with favicon variants.
- [jokes] Ability to insert new jokes through form input and lookup random jokes by anyone.

### Changed
- [general] Enhanced readme documentation.

### Fixed

## [1.0.1] - 2024-09-01

### Added
- [general] Internalization of static frontend texts with `sveltekit-i18n` library supporting de and en locales.
- [admin] Admin panel for viewing metrics, managing toggles and approve jokes.
- [toggles] Global features toggle management using already existing key-value persistence.
- [backend] Unit tests for core features.

### Changed
- [general] Refactored frontend code architecture to improve readability.
- [uno-sort] Enhanced `uno-sort` component for better user experience.

### Fixed

## [1.0.0] - 2024-06-02

### Added
- [general] Initial project version setup including already existing features like memorandum, uno sort, lists, catch-em-all, settings and about me.
- [general] Automatic ci / cd pipeline with GitHub Actions.
- [general] Git hooks for pre-commit checks and post-commit gitmoji commit messages.

### Changed

### Fixed
