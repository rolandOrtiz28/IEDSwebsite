document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll(".stat-box h1");
    const statsContainer = document.querySelector(".stats-container");

    let isCounting = false; // Flag to prevent overlapping counts

    // Function to start counting
    function startCounting() {
        if (isCounting) return;
        isCounting = true;

        counters.forEach((counter) => {
            counter.textContent = 0; // Reset counter on each start
            const target = +counter.dataset.target; // Use a data attribute for target value
            const animationDuration = 2000; // 2 seconds
            const step = (target / (animationDuration / 16)) * 2;

            let currentCount = 0;
            const countInterval = setInterval(() => {
                if (currentCount < target) {
                    currentCount += step;
                    counter.textContent = Math.round(currentCount);
                } else {
                    counter.textContent = target;
                    clearInterval(countInterval);
                    isCounting = false; // Reset the counting flag

                    // Check if all counters have finished counting
                    const allCounted = Array.from(counters).every(
                        (c) => +c.textContent === +c.dataset.target
                    );
                    if (allCounted) {
                        // Remove scroll event listener after all counters are counted
                        window.removeEventListener("scroll", handleScroll);
                    }
                }
            }, 16);

            // Apply animation class
            counter.parentElement.classList.add("animate");
        });
    }

    // Function to handle scroll event
    function handleScroll() {
        if (isElementInViewport(statsContainer)) {
            startCounting();
        }
    }

    // Check if the stats section is in view
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    // Reset counters on page load
    startCounting();

    // Listen for scroll event with throttling (debounce)
    let isScrolling;
    window.addEventListener("scroll", () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(handleScroll, 100);
    });
});
