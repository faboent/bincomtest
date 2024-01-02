
// Fetch data from the server
fetch('/data')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('table-body');

    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.party_abbreviation}</td><td>${row.party_score}</td><td>${row.entered_by_user}</td><td>${row.date_entered}</td>`;
      tableBody.appendChild(tr);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    // Handle error if any
  });

function fetchSummedResults() {
  const selectedLocalGovt = document.getElementById('local-govt').value;

  fetch(`/summed-results?localGovt=${selectedLocalGovt}`)
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById('summed-table-body');
      tableBody.innerHTML = ''; // Clear previous data

      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.party_abbreviation}</td><td>${row.total_score}</td>`;
        tableBody.appendChild(tr);
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // Handle error if any
    });
}