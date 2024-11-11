import { createRequire } from 'node:module';
import actions from '@actions/core';
import { compare } from 'semver';

const require = createRequire(import.meta.url);

if (process.env[2] == 'frontend') {
	const packagejsonFile = require('../../package.json');
	fetch('https://antomanga.pythonanywhere.com/api/v2/version/')
		.then((res) => res.json())
		.then((res) => {
			if (compare(packagejsonFile.version, res.frontendVersion) > 0) {
				actions.info('frontend version is ok');
			} else {
				actions.setFailed('version is not bumped');
			}
		})
		.catch((err) => actions.setFailed(`server off:  ${err}`));
} else if (process.env[2] == 'backend') {
	const versionjsonServerFile = require('../../../version.json');
	fetch('https://antomanga.pythonanywhere.com/api/v2/version/')
		.then((res) => res.json())
		.then((res) => {
			if (compare(versionjsonServerFile.version, res.backendVersion) > 0) {
				actions.info('backend version is ok');
			} else {
				actions.setFailed('backend is not bumped');
			}
		})
		.catch((err) => actions.setFailed(`server off:  ${err}`));
}
