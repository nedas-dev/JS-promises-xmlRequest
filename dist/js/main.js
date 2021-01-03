const astronautsUrlAPI = 'http://api.open-notify.org/astros.json';
const wikiUrlAPI = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const mainSection = document.querySelector('section.people');

/* This*/
function getJSON(url) {
    return new Promise((resolve, reject) => {
        const xml = new XMLHttpRequest();
        xml.onload = () => {
            if (xml.status == 200) {
                resolve(JSON.parse(xml.responseText));
            } else {
                reject(Error('Could not get the JSON file'));
            }

        }
        xml.onerror = () => {
            reject(Error('Network error. Did you type in the correct link?'));
        }
        xml.open('GET', url);
        xml.send();
    })
}

function getProfiles(data) {
    const items = data.people.map(people => {
        return getJSON(wikiUrlAPI + people.name)
    })
    return Promise.all(items);
}



function generateHTML(data) {
    data.forEach(person => {
        const section = document.createElement('section');
        const pictureExists = 'thumbnail' in person;
        if (pictureExists) {
            section.innerHTML = `
            <img src=${person.thumbnail.source}>
            <div>
                <h2>${person.displaytitle}</h2>
                <p>${person.description}</p>
                <p>${person.extract}</p>
            </div>
            `

            if (mainSection.children.length > 0) {
                const firstChild = mainSection.firstElementChild;
                mainSection.insertBefore(section, firstChild)
            } else {
                mainSection.appendChild(section);
            }
        } else {
            section.innerHTML = `
            <img width="260" height="340" src="https://i.pinimg.com/736x/96/34/62/9634629ee6707f329d6194ceded5f0fe.jpg">
            <div>
                <h2>${person.displaytitle}</h2>
                <p>${person.description}</p>
                <p>${person.extract}</p>
            </div>
            `
            mainSection.appendChild(section);
        }

    });
}

getJSON(astronautsUrlAPI)
    .then(getProfiles)
    .then(generateHTML)
    .finally(() => console.log('Mission Completed!'))
    .catch(val => console.log(val))