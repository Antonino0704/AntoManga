import type { Series } from '../@types/interfaces';

function checkDataStats(series: Series): boolean {
	if (
		series.n_volumes <= 0 ||
		series.volumes_bought < 0 ||
		typeof series.volumes_bought != 'number' ||
		series.volumes_read < 0 ||
		typeof series.volumes_read != 'number'
	)
		return false;
	if (series.n_volumes < series.volumes_bought || series.volumes_bought < series.volumes_read)
		return false;
	return true;
}

function showErrors(
	series: Series,
	t: (key: string, values?: Record<string, unknown>) => string
): string {
	let error = '';
	if (typeof series.n_volumes != 'number') {
		document.querySelector('#inputNVol')!.className = 'form-control is-invalid';
		error = t('common.errors.nVolumes');
	} else if (series.n_volumes == 0) {
		document.querySelector('#inputNVol')!.className = 'form-control is-invalid';
		error = t('common.errors.nVolumes0');
	} else if (series.n_volumes < 0) {
		document.querySelector('#inputNVol')!.className = 'form-control is-invalid';
		error = t('common.errors.nVolumesNegative');
	}
	if (series.volumes_bought < 0) {
		document.querySelector('#inputBought')!.className = 'form-control is-invalid';
		error = t('common.errors.volBoughtNegative');
	}
	if (series.volumes_read < 0) {
		document.querySelector('#inputRead')!.className = 'form-control is-invalid';
		error = t('common.errors.volReadNegative');
	}
	if (series.n_volumes < series.volumes_bought) {
		document.querySelector('#inputBought')!.className = 'form-control is-invalid';
		error = t('common.errors.volBoughtThanNVolumes');
	}
	if (series.volumes_bought < series.volumes_read) {
		document.querySelector('#inputRead')!.className = 'form-control is-invalid';
		error = t('common.errors.volReadThanVolBought');
	}
	if (typeof series.volumes_bought != 'number') {
		document.querySelector('#inputBought')!.className = 'form-control is-invalid';
		error = t('common.errors.volBought');
	}
	if (typeof series.volumes_read != 'number') {
		document.querySelector('#inputRead')!.className = 'form-control is-invalid';
		error = t('common.errors.volRead');
	}
	return error;
}

function resetErrors(): void {
	document.querySelector('#inputNVol')!.className = 'form-control';
	document.querySelector('#inputBought')!.className = 'form-control';
	document.querySelector('#inputRead')!.className = 'form-control';
}

export { checkDataStats, showErrors, resetErrors };
