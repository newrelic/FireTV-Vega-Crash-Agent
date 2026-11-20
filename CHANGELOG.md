# CHANGELOG
All notable changes to this project will be documented in this file.

## [1.0.67-beta] - 2026/11/20
### Added
- Added Japan (JP) region support for crash reporting endpoint.

### Fixed
- Bumped `@amazon-devices/kepler-file-system` from `^0.0.4` to `^0.0.9` to resolve failure on Vega OS 2.0 / React Native 0.83.

### Changed
- Updated dev toolchain for React Native 0.83 compatibility: replaced `metro-react-native-babel-preset` with `@react-native/babel-preset`, upgraded TypeScript from `4.8.4` to `5.8.3`, and upgraded Jest from `^28.x` to `^29.x`.

## [1.0.66-beta] - 2025/11/14
### Fixed
- Fixed `setCustomAttributes` metadata parsing issue with comma-separated values 

## [1.0.65-beta] - 2025/10/24
### Initial release:

- Native Crash Detection**: Captures critical signals (`SIGSEGV`, `SIGBUS`, `SIGFPE`, `SIGILL`, `SIGABRT`, `SIGTRAP`).
- Automatic Reporting**: Sends crash reports directly to New Relic.
- Fallback File Storage**: Automatically saves errors locally when the network is unavailable.
- Automatic Retry**: Processes pending error files on app restart.
- Custom Attributes**: Add custom key-value pairs to crash reports.
- Error Recording**: Record non-fatal errors with stack traces.
- Test Functionality**: Built-in Vega application for crash testing for validation.
