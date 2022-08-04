document.querySelector("#orderId").textContent = new URLSearchParams(
	window.location.search
).get("id");
