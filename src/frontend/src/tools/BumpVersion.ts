import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import * as actions from '@actions/core';
import { coerce, inc } from 'semver';

const require = createRequire(import.meta.url);

const packagejsonFile = require('../../package.json');
const versionjsonServerFile = require('../../../version.json');

writeFile(
	'./package.json',
	JSON.stringify(
		{
			...packagejsonFile,
			version: inc(coerce(packagejsonFile.version)!, 'patch')
		},
		null,
		'\t'
	)
)
	.then(() => actions.info('frontend bumped'))
	.catch((err) => actions.setFailed(err));

writeFile(
	'../version.json',
	JSON.stringify(
		{
			...versionjsonServerFile,
			version: inc(coerce(versionjsonServerFile.version)!, 'patch')
		},
		null,
		'\t'
	)
)
	.then(() => actions.info('backend bumped'))
	.catch((err) => actions.setFailed(err));
