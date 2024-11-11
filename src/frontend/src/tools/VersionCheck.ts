import { createRequire } from 'node:module';
import actions from '@actions/core';
import { compare } from 'semver';

const require = createRequire(import.meta.url);
const url = 'https://antomanga.pythonanywhere.com/api/v3/version/'

if (process.env.architecture == 'frontend') {
	const packagejsonFile = require('../../package.json');
	fetch(url)
		.then((res) => res.json())
		.then((res) => {
			if (compare(packagejsonFile.version, res.frontendVersion) > 0) {
				actions.info('frontend version is ok');
			} else {
				actions.setFailed('version is not bumped');
			}
		})
		.catch((err) => actions.setFailed(`server off:  ${err}`));
} else if (process.env.architecture == 'backend') {
	const versionjsonServerFile = require('../../../version.json');
	fetch(url)
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
console.log(process.env.architecture == 'frontend')
