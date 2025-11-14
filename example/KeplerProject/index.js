/*
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import {AppRegistry, LogBox} from 'react-native';
import {App} from './src/App';
import {name as appName} from './app.json';
import {NrKeplerCrash} from '@amzn/nrkeplercrash';

// Temporary workaround for problem with nested text
// not working currently.
LogBox.ignoreAllLogs();

NrKeplerCrash.registerHandler("<ACCOUNT ID>", "<API KEY>", "<US or EU>");

NrKeplerCrash.setSessionId('22OCT_001');

AppRegistry.registerComponent(appName, () => App);
