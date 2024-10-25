import { createRequire } from 'node:module';
import actions from '@actions/core';
import { compare } from 'semver';

const require = createRequire(import.meta.url);

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
