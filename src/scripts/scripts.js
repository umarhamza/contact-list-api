(function () {
    // Get input element
    const filterInput = document.getElementById('filter-input');
    // Get the ul list of all names
    const list = document.querySelector('#names');
    // Retrieve data from local storage
    const storedData = JSON.parse(localStorage.getItem('names'));

    // Initiate all functions 
    const initAll = () => {
        CheckData();
        Input();
    } // initAll

    const CheckData = () => {
        if (storedData) {
            CreateList(storedData);
        } else {
            LoadData();
        }
    } // CheckData

    const LoadData = () => {
        const request = new XMLHttpRequest();
        request.open('GET', 'https://uinames.com/api/?amount=25?region=united-kingdom', true);

        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                const data = JSON.parse(this.response);
                StoreData(data);
                CreateList(data);
            } else {
                console.error('server returned an error');
            }
        };

        request.onerror = function () {
            console.error('There was a connection error of some sort');
        };

        request.send();
    } // LoadData

    const StoreData = (loadedData) => {
        localStorage.setItem('names', JSON.stringify(loadedData));
    } // StoreData

    const Input = () => {
        // Add keyup event listener on input
        filterInput.addEventListener('keyup', filterNames);

        function filterNames(e) { 
            // Get value inside input
            const filterValue = this.value.toUpperCase();
            // Get the li list item
            const listItem = list.querySelectorAll('li.collection-item');

            // loop through collection item li's
            listItem.forEach(item => {
                // Get the anchor inside each item
                const anchor = item.querySelector('a');
                // Get anchor text
                const anchorText = anchor.innerHTML.toUpperCase();

                if (anchorText.indexOf(filterValue) > -1) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });

        }
    } // Input

    const CreateList = (data) => {
        const names = data.map(item => {
            return item.name;
        }).sort();

        let items = ``;
        let firstLetter = '';

        names.forEach(function(name, i, arr) {
            if (firstLetter === name[0]) {
                items += `
                    <li class="collection-item">
                        <a href="#">${name}</a>
                    </li>
                `;
            } else {
                firstLetter = name[0];
                items += `
                    <li class="collection-header"><h5>${firstLetter}</h5></li>
                    <li class="collection-item"><a href="#">${name}</a></li>
                `;
            }

            list.innerHTML = items;
        });
    } // CreateList

    document.addEventListener('DOMContentLoaded', initAll)

})();



