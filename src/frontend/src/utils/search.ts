function search(textFromSearchBar: string, filter: string): void {
	const list = document.querySelectorAll<HTMLLIElement>('.list');
	for (let i = 0; i < list.length; i++) {
		const mangaTitle = list[i]?.querySelector('div > div > h5');

		const mangaType = list[i]?.querySelector('div > div > p');

		const textValue = mangaTitle!.textContent;
		const textValueType = mangaType!.textContent;
		if (
			textValue!.toLocaleLowerCase().indexOf(textFromSearchBar) > -1 &&
			(textValueType!.toLocaleLowerCase().indexOf(`type: ${filter}`) > -1 || filter === 'null')
		) {
			list[i].style.display = '';
		} else {
			list[i].style.display = 'none';
		}
	}
}

export { search };
