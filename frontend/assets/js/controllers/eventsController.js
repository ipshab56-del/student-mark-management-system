// Hardcoded Indian holidays for 2026
const holidays2026 = [
    { date: '2026-01-26', name: 'Republic Day', type: 'Holiday' },
    { date: '2026-03-14', name: 'Holi', type: 'Holiday' },
    { date: '2026-03-30', name: 'Ram Navami', type: 'Observation' },
    { date: '2026-03-31', name: 'Eid al-Fitr', type: 'Observation' },
    { date: '2026-04-03', name: 'Good Friday', type: 'Observation' },
    { date: '2026-04-10', name: 'Mahavir Jayanti', type: 'Observation' },
    { date: '2026-05-01', name: 'Labour Day', type: 'Holiday' },
    { date: '2026-05-14', name: 'Buddha Purnima', type: 'Observation' },
    { date: '2026-08-15', name: 'Independence Day', type: 'Holiday' },
    { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'Holiday' },
    { date: '2026-10-31', name: 'Diwali', type: 'Holiday' },
    { date: '2026-12-25', name: 'Christmas', type: 'Holiday' }
];

// Function to render the holidays table
function renderHolidaysTable() {
    const tableBody = document.getElementById('holidaysTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    holidays2026.forEach(holiday => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${holiday.date}</td>
            <td>${holiday.name}</td>
            <td>${holiday.type}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Initialize the events controller
export function initEventsController() {
    console.log("CONTROLLER: events controller initialized");
    renderHolidaysTable();
}
