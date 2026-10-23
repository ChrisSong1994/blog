export function Tag({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex h-5 items-center rounded-md bg-gray-300 px-2 text-xs text-gray-800">
			{children}
		</span>
	);
}
