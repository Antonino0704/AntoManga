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

function showErrors(series: Series): string {
	let error = '';
	if (typeof series.n_volumes != 'number') {
		document.querySelector('#inputNVol')!.className = 'form-control is-invalid';
		error = "n volumes can't be blank";
	} else if (series.n_volumes == 0) {
		document.querySelector('#inputNVol')!.className = 'form-control is-invalid';
		error = "n volumes can't be 0";
	} else if (series.n_volumes < 0) {
		document.querySelector('#inputNVol')!.className = 'form-control is-invalid';
		error = "n volumes can't be negative";
	}
	if (series.volumes_bought < 0) {
		document.querySelector('#inputBought')!.className = 'form-control is-invalid';
		error = "volumes bought can't be negative";
	}
	if (series.volumes_read < 0) {
		document.querySelector('#inputRead')!.className = 'form-control is-invalid';
		error = "volumes read can't be negative";
	}
	if (series.n_volumes < series.volumes_bought) {
		document.querySelector('#inputBought')!.className = 'form-control is-invalid';
		error = "the volumes bought can't be more than total volumes";
	}
	if (series.volumes_bought < series.volumes_read) {
		document.querySelector('#inputRead')!.className = 'form-control is-invalid';
		error = "the volumes read can't be more than total bought";
	}
	if (typeof series.volumes_bought != 'number') {
		document.querySelector('#inputBought')!.className = 'form-control is-invalid';
		error = "volumes bought can't be blank";
	}
	if (typeof series.volumes_read != 'number') {
		document.querySelector('#inputRead')!.className = 'form-control is-invalid';
		error = "volumes read can't be blank";
	}
	return error;
}

function resetErrors(): void {
	document.querySelector('#inputNVol')!.className = 'form-control';
	document.querySelector('#inputBought')!.className = 'form-control';
	document.querySelector('#inputRead')!.className = 'form-control';
}

export { checkDataStats, showErrors, resetErrors };
