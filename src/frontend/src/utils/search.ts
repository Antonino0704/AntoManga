function search(textFromSearchBar: string, filter: string): void {
	const list = document.getElementsByClassName('list');
	for (let i = 0; i < list.length; i++) {
		const mangaTitle = list[i]
			.getElementsByTagName('div')[0]
			.getElementsByTagName('div')[0]
			.getElementsByTagName('h5')[0];

		const mangaType = list[i]
			.getElementsByTagName('div')[0]
			.getElementsByTagName('div')[0]
			.getElementsByTagName('p')[0];

		const textValue: any = mangaTitle.innerHTML || mangaTitle.textContent;
		const textValueType: any = mangaType.innerHTML || mangaType.textContent;
		if (
			textValue.toLocaleLowerCase().indexOf(textFromSearchBar) > -1 &&
			(textValueType.toLocaleLowerCase().indexOf(`type: ${filter}`) > -1 || filter === 'null')
		) {
			list[i].style.display = '';
		} else {
			list[i].style.display = 'none';
		}
	}
}

export { search };
