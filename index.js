function search() {
    var inputVal = $("#search-input").val();
    var searchUrl = "https://newyork.craigslist.org/search/sss?query=" + encodeURIComponent(inputVal);
    window.location.href = searchUrl;
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

// Dynamic calendar using JS.
// Please don't judge, spent many hours on this :( probably 100 better ways to do this.. But hey it works!
function generateCalendar(month, year) {
    const calendarBody = document.getElementById("calendar-body");
    calendarBody.innerHTML = ""; // Clear previous cal.

    const firstDay = new Date(year, month - 1, 1).getDay();
    const days = daysInMonth(month, year);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add empty cells for days before the first day of the month
    let row = document.createElement("tr");
    for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement("td");
        cell.innerHTML = "";
        row.appendChild(cell);
    }

   // Add cells for each day in the month
   for (let day = 1; day <= days; day++) {
    const date = new Date(year, month - 1, day);
    const dateStr = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const cell = document.createElement("td");

    if (date >= today) {
        const link = document.createElement("a");
        link.href = `//newyork.craigslist.org/search/eee?sale_date=${dateStr}`;
        link.textContent = day;
        cell.appendChild(link);
    } else {
        cell.textContent = day;
    }
    row.appendChild(cell);

    // Start a new row when reaching 7th day
    if ((day + firstDay) % 7 === 0) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
        }
    }

    // Fill the remaining cells in the last row with empty cells
    // I'd like to continue on to the next month, but this is taking too much time. However in a finished product, this would of course be fixed.
    while (row.childElementCount < 7) {
        const cell = document.createElement("td");
        cell.innerHTML = "";
        row.appendChild(cell);
    }
    calendarBody.appendChild(row);
    

    // Highlight the "today" cell after calendar has finished generating.
    updateTodayCell();
}

function updateTodayCell() {
    const today = new Date();
    const cells = document.querySelectorAll("#event-calendar a");

    for (let cell of cells) {
        const cellDate = new Date(cell.href.split("sale_date=")[1]);
        if (cellDate.getFullYear() === today.getFullYear() && cellDate.getMonth() === today.getMonth() && cellDate.getDate() === today.getDate()) {
            cell.parentNode.classList.add("table-info");
        } else {
            cell.parentNode.classList.remove("table-info");
        }
    }
}

// Get all the <a> elements in the middle-column div.
// Attach click event listeners to each element, so that I don't need to spam the onClick() function on each one.
// However, this is a classic example of spending too much time on something trivial..
$(document).ready(function() {
    var animationInProgress = false;

    $('#middle-column a').on('click', function(e) {
        e.preventDefault(); // Prevent link behaviour.

        if(animationInProgress) {
            return;
        }
        animationInProgress = true;

        var itemText = $(this).text();
        $('#message').text('This link would lead to the appropriate destination: ' + itemText);
        $('#message').stop().fadeIn(300).delay(2000).fadeOut(1000, function() {
            $(this).text('');
            animationInProgress = false;
        });
    });
});

// Make the arrow icon flip in the listings menus.
$(document).ready(function() {
    var isAnimating = false;

    $('.btn').on('click', function() {
        if (!isAnimating) {
            var arrowIcon = $(this).find('.arrow-icon');
            arrowIcon.stop().toggleClass('expanded');
            isAnimating = true;

            setTimeout(function() {
                isAnimating = false;
            }, 300);
        }
    });
});  

// scroll to top =)
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// collapse all menus in the center div.
function collapseAllMenus() {
    $('#middle-column .btn-listing').each(function() {
        const targetId = $(this).data('bs-target');
        const targetCollapse = $(targetId);

        if (targetCollapse.hasClass('show')) {
            $(this).attr('aria-expanded', 'false');
            targetCollapse.collapse('hide');
        }
    });
}

// expand all menus in the center div.
function expandAllMenus() {
    $('#middle-column .btn-listing').each(function() {
        const targetId = $(this).data('bs-target');
        const targetCollapse = $(targetId);

        if (!targetCollapse.hasClass('show')) {
            $(this).attr('aria-expanded', 'true');
            targetCollapse.collapse('show');
        }
    });
}

// Collapse the calendar when the page is being scrolled.
$(document).ready(function() {
    var eventCalendar = $("#event-calendar-collapse");

    $(window).scroll(function() {
        if ($(window).width() >= 992) {
            eventCalendar.collapse('hide');
        }
    });
});
  