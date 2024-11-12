import { cva } from "class-variance-authority";

export const terminalButtonVariants = cva("terminal-button", {
	variants: {
		variant: {
			close: "terminal-button-variant-close",
			minimize: "terminal-button-variant-minimize",
			maximize: "terminal-button-variant-maximize",
		},
	},
	defaultVariants: {
		variant: "close",
	},
});
export const terminalCardVariants = cva("terminal-card", {
	variants: {
		size: {
			default: "terminal-size-default",
			maximize: "terminal-size-maximize",
			minimize: "terminal-size-minimize",
		},
	},
	defaultVariants: {
		size: "default",
	},
});
export const terminalContentVariants = cva("terminal-content", {
	variants: {
		variant: {
			default: "terminal-content-variant-default",
			minimize: "terminal-content-variant-minimize",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});
export const terminalHeaderVariants = cva("terminal-header", {
	variants: {
		variant: {
			default: "terminal-header-variant-default",
			minimize: "terminal-header-variant-minimize",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});
export const terminalButtonListVariants = cva("terminal-button-list", {
	variants: {
		variant: {
			default: "terminal-button-list-variant-default",
			minimize: "terminal-button-list-variant-minimize",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export const terminalModalVariants = cva("", {
	variants: {
		size: {
			default: "terminal-modal-size-default",
			maximize: "terminal-modal-size-maximize",
			minimize: "terminal-modal-size-minimize",
		},
	},
	defaultVariants: {
		size: "default",
	},
});
