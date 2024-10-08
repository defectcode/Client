import { HeaderMenu } from './header-menu/HeaderMenu';
import { Logo } from './logo/Logo';
import { SearchInput } from './search-input/SearchInput';

export function Header() {
	return (
		<div className="p-5 max-w-[1400px] w-full h-full flex items-center justify-between bg-transparent mx-auto">
			<div className="flex-1">
				<HeaderMenu />
			</div>
			<div className="flex-1 flex justify-center">
				<Logo />
			</div>
			<div className="flex-1 flex justify-end">
				<SearchInput />
			</div>
		</div>
	);
}
