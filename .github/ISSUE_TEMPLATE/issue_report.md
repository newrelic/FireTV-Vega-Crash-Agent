---
name: Bug Report
about: Report a bug or issue with the FireTV Vega Crash Agent
title: "[Issue]: "
labels: issue
assignees: ''
---

## FAQ Checklist

Please confirm each of the following before submitting your issue.

- [ ] I have registered the crash agent as outlined in the [README](../blob/main/README.md).
- [ ] After the crash occurred, I checked the crash logs in New Relic logs under the **same account** used in `registerHandler`.
- [ ] If I am using a `WebView` component, I confirm that `registerHandler` is called inside the `onLoad` prop of the `WebView` — this ensures it runs only after the web context is fully initialized. _(Tick if not applicable.)_
- [ ] Tested in Release mode.

## Describe the issue

<!-- A clear and concise description of what the bug is. -->

## Steps to reproduce

1.
2.
3.

## Expected behavior

<!-- What did you expect to happen? -->

## Crash Agent version

<!-- e.g. 1.0.66-beta -->


## Relevant logs / screenshots

<!-- Paste any relevant New Relic crash logs, console output, or screenshots here. -->
