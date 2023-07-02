import { useScrollTrigger, Zoom, Fab } from "@mui/material";


const ScrollTop = ({ children }) => {
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 100,
	});

	const handleClick = () => {
		const anchor = document.querySelector("#back-to-top-anchor");
		if (anchor) {
			anchor.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	return (
		<Zoom in={trigger}>
			<div
				onClick={handleClick}
				role="presentation"
				style={{ position: "fixed", bottom: 16, right: 16 }}
			>
				{children}
			</div>
		</Zoom>
	);
};  

export default ScrollTop;