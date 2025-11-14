# CHANGELOG
All notable changes to this project will be documented in this file.

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
