
const date = new Date();

const events = {}; // This will store events in the format { 'YYYY-MM-DD': [event1, event2, ...] }

const renderCalendar = () => {
    date.setDate(1); // Set to the first day of the month

    const monthDays = document.querySelector(".days");
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

    // Get the day of the week for the first day of the month
    const firstDayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();

    const nextDays = 7 - lastDayIndex - 1;

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    document.querySelector('.date h1').innerHTML = months[date.getMonth()];
    document.querySelector(".date p").innerHTML = new Date().toDateString();

    let days = "";

    // Render previous month's days
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
    }

    // Render current month's days
    for (let i = 1; i <= lastDay; i++) {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        const todayClass = (i === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) ? 'today' : '';

        let eventsMarkup = '';
        if (events[formattedDate]) {
            eventsMarkup = `<ul>${events[formattedDate].map((event, index) => `<li>${event} <button class="delete-event" data-date="${formattedDate}" data-index="${index}">Delete</button></li>`).join('')}</ul>`;
        }

        days += `<div class="${todayClass}" data-date="${formattedDate}">${i}${eventsMarkup}</div>`;
    }

    // Render next month's days
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="next-date">${j}</div>`;
    }

    monthDays.innerHTML = days;
}

document.querySelector('.prev').addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.querySelector('.next').addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

document.getElementById('add-event').addEventListener('click', () => {
    const eventDate = document.getElementById('event-date').value;
    const eventDescription = document.getElementById('event-description').value;

    if (eventDate && eventDescription) {
        if (!events[eventDate]) {
            events[eventDate] = [];
        }
        events[eventDate].push(eventDescription);
        document.getElementById('event-description').value = ''; // Clear input
        renderCalendar();
    } else {
        alert('Please enter both date and description');
    }
});

// Handle event deletion
document.querySelector('.days').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-event')) {
        const dateToDelete = event.target.getAttribute('data-date');
        const indexToDelete = event.target.getAttribute('data-index');

        if (events[dateToDelete] && events[dateToDelete][indexToDelete]) {
            events[dateToDelete].splice(indexToDelete, 1); // Remove event from array

            // Remove the event key if no events left for the date
            if (events[dateToDelete].length === 0) {
                delete events[dateToDelete];
            }

            renderCalendar();
        }
    }
});
