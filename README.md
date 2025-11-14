
# New Relic FireTV Crash Agent

🚀 **BETA RELEASE** 🚀

The New Relic Vega Crash Turbo Module ( @amzn/nrkeplercrash ) is a native crash reporting solution
designed specifically for Vega applications. It captures native crashes and automatically reports them to
New Relic for monitoring and analysis.

## Key Features

- **Native Crash Detection**: Captures SIGSEGV, SIGBUS, SIGFPE, SIGILL, SIGABRT, and SIGTRAP signals
- **Automatic Reporting**: Sends crash reports directly to New Relic
- **Custom Attributes**: Add custom key-value pairs to crash reports for enhanced debugging
- **Session Management**: Track user sessions and associate crashes with specific users
- **Error Recording**: Record non-fatal errors with stack traces and automatic fallback storage
- **Fallback File Storage**: Automatically saves errors locally when network is unavailable
- **Automatic Retry**: Processes pending error files on app restart
- **Test Functionality**: Built-in crash testing for validation

## Requirements

* Kepler SDK v0.7+
* React Native v0.21.0+

## Installation

This repository contains a pre-built crash agent package that you can directly install in your FireTV Vega application.

## Important Migration Note

⚠️ **If you have a previous version of the New Relic Kepler Crash TurboModule installed, please uninstall it completely and remove all associated files from your project before installing this version.**

The current version (1.0.64-beta and later) streamlines the installation process - it only requires npm installation and does not require manual copying of assets or additional configuration files.

### Step 1: Download the Package

Download the latest beta release package from this repository:
- `amzn-nrkeplercrash-x.y.z-beta.tgz`

### Step 2: Install in Your Application

Navigate to your FireTV Vega application directory and install the package:

```bash
npm install path/to/amzn-nrkeplercrash-x.y.z-beta.tgz --save
```

## Setup

In the same place where you started the [FireTV-Vega-Agent](https://github.com/newrelic/FireTV-Vega-Agent#setup), import this turbo module:

``` javascript
import { NrKeplerCrash } from '@amzn/nrkeplercrash';
```

And, after the call to `startAgent`, register the crash handler.

```javascript
// Set Account ID, API Key and Endpoint (either "US" or "EU").
NrKeplerCrash.registerHandler("<ACCOUNT ID>", "<API KEY>", "<US or EU>");
```

## Configuration Parameters

- **accountId**: Your New Relic account ID
- **apiKey**: Your New Relic API key (Ingest - License key)
- **endpoint**: Region endpoint - "US" or "EU"
- **appVersion (Optional)**: Your application version string

## Quick Start Example

```javascript
import { NrKeplerCrash } from '@amzn/nrkeplercrash';

// 1. Initialize crash reporting
NrKeplerCrash.registerHandler("YOUR_ACCOUNT_ID", "YOUR_API_KEY", "US", "1.0.0");

// 2. Set session context
NrKeplerCrash.setSessionId(`session-${Date.now()}`);

// 3. Add custom attributes
NrKeplerCrash.setCustomAttributes({
    userId: "user123",
    environment: "production",
    feature: "checkout"
});

// 4. Record errors (async with fallback storage)
try {
    await riskyOperation();
} catch (error) {
    try {
        const result = await NrKeplerCrash.recordError(error.message, error.stack);
        console.log('Error recorded:', result);
    } catch (recordingError) {
        console.error('Failed to record error:', recordingError);
    }
}
```

## Build Your App

Build and run your Vega application as normal:

```bash
kepler build
```

## Testing

The New Relic vega Crash turbo module provides a method to force a crash. You can call it to check that it can actually track crashes and report data to New Relic. Just call this method:

```javascript
NrKeplerCrash.crashNow();
```

## API Reference

### Configuration Methods

#### `registerHandler(accountId: string, apiKey: string, endpoint: string, appVersion?: string): void`

Registers the crash handler with New Relic configuration.

**Parameters:**
- `accountId`: New Relic account ID
- `apiKey`: New Relic API key
- `endpoint`: "US" or "EU" region
- `appVersion` (Optional): Application version

```javascript
NrKeplerCrash.registerHandler(
    "1234567890",
    "NRAK-XXXXXXXXXXXXXXXXXXXX",
    "US",
    "2.1.0"
);
```

#### `setSessionId(sessionId: string): void`

Sets the session ID for crash reports.

```javascript
NrKeplerCrash.setSessionId("session-12345-67890");
```

#### `setDeviceId(deviceId: string): void`

Sets the device ID for crash reports.

```javascript
NrKeplerCrash.setDeviceId("device-12345-67890");
```

### Custom Attributes

Custom attributes have a maximum limit of 150 entries. When this limit is exceeded, the oldest attributes are automatically removed to make room for new ones.

#### `setCustomAttributes(attributes: object): boolean`

Sets custom attributes for crash reports (replaces existing attributes). If more than 150 attributes are provided, only the latest 150 will be kept.

**Returns:** `true` if attributes were successfully set, `false` otherwise.

```javascript
NrKeplerCrash.setCustomAttributes({
    userId: "user123",
    environment: "production",
    feature: "checkout",
    buildNumber: 123,
    isProduction: true
});
```

#### `addCustomAttributes(attributes: object): boolean`

Adds custom attributes to existing attributes (merges with existing). Uses a FIFO queue system - when the 150 attribute limit is exceeded, the oldest attributes are automatically removed to make room for new ones.

**Returns:** `true` if attributes were successfully added, `false` otherwise.

```javascript
NrKeplerCrash.addCustomAttributes({
    screen: "payment",
    action: "submit",
    timestamp: Date.now()
});
```

### Error Reporting

#### `recordError(errorMessage: string, errorStack: string): Promise<string>`

Records a non-fatal error with stack trace asynchronously.

**Returns:** Promise that resolves with "success" if sent immediately, or "File stored successfully" in `/data` if saved locally for retry. Rejects with "File failed to store" if both network and file storage fail.

**Note:** If you need to read or check the files written, you can check amazon file system api.

```javascript
import { KeplerFileSystem as FileSystem } from '@amazon-devices/kepler-file-system';

const handleReadFileAsString = async () => {
    FileSystem.readFileAsString('/data/fileToReadWrite', 'UTF-8')
        .then((response: any) => console.log(response))
        .catch((error: any) => console.error(error));
};

try {
    // Some operation that might fail
    riskyOperation();
} catch (error) {
    try {
        const result = await NrKeplerCrash.recordError(
            error.message,
            error.stack || "No stack trace available"
        );
        if (result === 'success') {
            console.log("Error sent to New Relic immediately");
        } else {
            console.log("Error saved locally for retry:", result);
        }
    } catch (recordingError) {
        console.error("Failed to record error:", recordingError);
    }
}
```

### Development & Testing

#### `crashNow(signalNumber: Int32): void`

Forces an immediate crash for testing purposes.

⚠️ **WARNING:** This method is for testing only and must NOT be used in production environments.

```javascript
// Test different crash signals
NrKeplerCrash.crashNow(11); // SIGSEGV
NrKeplerCrash.crashNow(6);  // SIGABRT
NrKeplerCrash.crashNow(4);  // SIGILL

// Basic test crash
NrKeplerCrash.crashNow();
```

#### Signal Numbers Reference

- **SIGSEGV (11)**: Segmentation fault
- **SIGBUS (7)**: Bus error
- **SIGFPE (8)**: Floating point exception
- **SIGILL (4)**: Illegal instruction
- **SIGABRT (6)**: Abort signal
- **SIGTRAP (5)**: Trace/breakpoint trap

## Advanced Usage

### Complete Integration Example

```javascript
import { NrKeplerCrash } from '@amzn/nrkeplercrash';

class CrashReportingService {
    constructor() {
        this.isInitialized = false;
    }

    async initialize(config) {
        try {
            // Register crash handler
            NrKeplerCrash.registerHandler(
                config.accountId,
                config.apiKey,
                config.region,
                config.appVersion
            );

            // Set session information
            NrKeplerCrash.setSessionId(this.generateSessionId());

            // Set initial custom attributes
            NrKeplerCrash.setCustomAttributes({
                platform: "kepler",
                environment: config.environment,
                buildType: config.buildType
            });

            this.isInitialized = true;
            console.log("Crash reporting initialized successfully");
        } catch (error) {
            console.error("Failed to initialize crash reporting:", error);
        }
    }

    recordUserAction(action, details) {
        if (!this.isInitialized) return;

        NrKeplerCrash.addCustomAttributes({
            lastAction: action,
            actionDetails: details,
            timestamp: new Date().toISOString()
        });
    }

    async recordError(error, context) {
        if (!this.isInitialized) return false;

        // Add contextual information
        NrKeplerCrash.addCustomAttributes({
            errorContext: context,
            errorTimestamp: new Date().toISOString()
        });

        // Record the error
        try {
            const result = await NrKeplerCrash.recordError(error.message, error.stack);
            return result;
        } catch (recordingError) {
            console.error('Failed to record error:', recordingError);
            return false;
        }
    }

    generateSessionId() {
        return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Usage
const crashReporting = new CrashReportingService();

// Initialize with your configuration
crashReporting.initialize({
    accountId: "YOUR_ACCOUNT_ID",
    apiKey: "YOUR_API_KEY",
    region: "US",
    appVersion: "1.0.0",
    environment: "production",
    buildType: "release"
});

// Record user actions
crashReporting.recordUserAction("button_click", "checkout_submit");

// Record errors
try {
    riskyFunction();
} catch (error) {
    await crashReporting.recordError(error, "payment_processing");
}
```

### Custom Attributes Best Practices

1. **Use meaningful keys**: Choose descriptive attribute names
2. **Respect the 150 limit**: System automatically manages overflow, but be mindful of the 150 attribute maximum
3. **Update contextually**: Add relevant attributes before operations that might crash
4. **Include debugging info**: Add user IDs, feature flags, and current state
5. **Consider attribute lifecycle**: Older attributes are automatically removed when limit is exceeded

```javascript
// Good attribute usage
NrKeplerCrash.addCustomAttributes({
    userId: currentUser.id,
    featureFlags: JSON.stringify(activeFeatures),
    currentView: getCurrentViewName(),
    memoryUsage: getMemoryUsage(),
    networkStatus: getNetworkStatus()
});
```

### Troubleshooting

#### Common Issues

1. **Crash reports not appearing in New Relic**
   - Check your API key and account ID
   - Ensure network connectivity to New Relic endpoints

2. **Build failures**
   - Verify Kepler SDK is properly installed
   - Check that all dependencies are installed with `npm install`
   - Ensure you have the correct architecture builds

3. **Module not found errors**
   - Verify the package was installed correctly
   - Check the import path matches the package name
   - Ensure the module is properly linked in your Kepler app

#### Debugging Tips

1. Enable verbose logging in your application to track module initialization
2. Use test crashes to verify the reporting pipeline works
3. Check New Relic Insights for incoming crash data
4. Monitor application logs for crash reporting errors

## Support

For support and questions:
- Visit the [New Relic Explorers Hub](https://support.newrelic.com/s/)
- File issues on the [project's GitHub repository](https://github.com/newrelic/FireTV-Vega-Crash-Agent/issues)
- Contact New Relic support through your account

## Contributing
We encourage your contributions to improve FireTV-Vega-Crash-Agent! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company,  please drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## License.

FireTV Crash Agent is licensed under the [New Relic Pre-release policy](https://docs.newrelic.com/docs/licenses/license-information/referenced-policies/new-relic-pre-release-policy/).

**Beta Release Notice:**
- This is a beta release suitable for testing and evaluation
- APIs may change in future versions based on feedback
- Please report issues and provide feedback via GitHub issues
- Contributions and pull requests are welcome
