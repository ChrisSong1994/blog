export function Tag({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center rounded-full border border-border/80 px-2.5 py-0.5 text-[11px] tracking-wide text-muted-foreground transition-colors group-hover:border-brand/30 group-hover:text-brand">
			{children}
		</span>
	);
}
