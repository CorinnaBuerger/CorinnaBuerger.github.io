const flashlight = document.querySelector("div.flashlight");

function timeoutFunc() {
	const style = flashlight.style.display;
	if (style === "none")
		flashlight.style.display = "inline-block";
	else
		flashlight.style.display = "none";
	setTimeout(timeoutFunc, 100);
}

timeoutFunc();
