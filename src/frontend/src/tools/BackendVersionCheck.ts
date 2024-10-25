import { createRequire } from 'node:module';
import actions from '@actions/core';
import { compare } from 'semver';

const require = createRequire(import.meta.url);

const versionjsonServerFile = require('../../../version.json');
fetch('https://antomanga.pythonanywhere.com/api/v2/version/')
	.then((res) => res.json())
	.then((res) => {
		if (compare(versionjsonServerFile.version, res.serverVersion) > 0) {
			actions.info('backend version is ok');
		} else {
			actions.setFailed('backend is not bumped');
		}
	})
	.catch((err) => actions.setFailed(`server off:  ${err}`));
