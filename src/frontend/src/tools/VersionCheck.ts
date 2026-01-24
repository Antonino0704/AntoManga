import { createRequire } from 'node:module';
import actions from '@actions/core';
import { compare } from 'semver';

const require = createRequire(import.meta.url);
const base = 'https://antomanga.pythonanywhere.com/api/';
const apiVersions = ['v5/', 'v4/'];
const urls = [`${base}${apiVersions[0]}version/`, `${base}${apiVersions[1]}version/`];

function requests(file: any, msgSuccess: string, msgNotSuccess: string) {
	urls.forEach((url) => {
		fetch(url)
			.then((res) => {
				if (res.headers.get('content-type') == 'text/html; charset=utf-8')
					throw new Error('api version is old');
				return res.json();
			})
			.then((res) => {
				if (
					compare(
						file.version,
						file.name == 'Backend-dev' ? res.backendVersion : res.frontendVersion
					) > 0
				) {
					actions.info(msgSuccess);
				} else {
					actions.setFailed(msgNotSuccess);
				}
			})
			.catch((err) => {
				if (err.message != 'api version is old') actions.setFailed(`server off:  ${err}`);
			});
	});
}

if (process.env.architecture == 'frontend') {
	const packagejsonFile = require('../../package.json');
	const msgSuccess = 'frontend version is ok';
	const msgNotSuccess = 'frontend version is not bumped';
	requests(packagejsonFile, msgSuccess, msgNotSuccess);
} else if (process.env.architecture == 'backend') {
	const versionjsonServerFile = require('../../../version.json');
	const msgSuccess = 'backend version is ok';
	const msgNotSuccess = 'backend is not bumped';
	requests(versionjsonServerFile, msgSuccess, msgNotSuccess);
} else {
	actions.setFailed('something went wrong');
}
