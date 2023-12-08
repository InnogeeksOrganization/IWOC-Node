document.addEventListener("mousemove", (e) => {
    // Create span for snowflake
    var snowflake = document.createElement("span");
    snowflake.classList.add("snowflake");

    snowflake.style.left = e.clientX + "px";
    snowflake.style.top = e.clientY + window.scrollY + "px";

    var size = Math.random() * (30 + 1);

    snowflake.style.width = size + "px";
    snowflake.style.height = size + "px";

    document.body.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 1000);
});
