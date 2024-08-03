
document.getElementById('resume-form').addEventListener('submit', function(e) {
    e.preventDefault();
    buildResume();
 });
document.getElementById('readme-form').addEventListener('submit', function(e) {
    e.preventDefault();
    explainReadme();
 });
document.getElementById('projects-form').addEventListener('submit', function(e) {
    e.preventDefault();
    fetchProjects();
 });

 function buildResume() {
    const username = document.getElementById('username').value;
    fetch(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .then(user => {
        console.log(user)
        const resumeContainer = document.getElementById('resume');
        resumeContainer.innerHTML = `
        <h3>${user.login}</h3>
        <p>${user.html_url}</p>
        `
    })
    .catch(error => console.error(error));
 }

 function explainReadme() {
    const repoLink = document.getElementById('readme').value;
    const ageGroup = document.getElementById('age-group').value;

    const repoParts = repoLink.replace('https://github.com/','').split('/');
    const username = repoParts[0];
    const repository = repoParts[1];

    fetch(`https://api.github.com/repos/${username}/${repository}/readme`,{
        headers: {
            Accept: "application/vnd.github.v3.raw"
        }  
    })
    .then (response => response.text())
    .then (content => {
        const chatgptContent = chatgptify(content, ageGroup);
        const readmeCurrentDiv = document.getElementById('readme-current');
        const readmeExplanationDiv = document.getElementById('readme-explanation');
        readmeCurrentDiv.innerHTML = `<h3>Readme:</h3> <pre> ${content}</pre>`;
        readmeExplanationDiv.innerHTML = `<h3>Explanation:</h3> <p> ${chatgptContent} </p>`;
    })
    .catch(error => console.error(error));
 }

 async function chatgptify(content, ageGroup) {
    const prompt = `Explain this readme to a ${ageGroup} year old: ${content}`;
    try {
        const response = await fetch('http://localhost:3000/api/explain-readme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content, ageGroup })
        });
        const data = await response.json();
        return data.explanation;
    } catch (error) {
        console.error('Error:', error);
        return "Sorry, I couldn't generate an explanation.";
    }
}

 
function fetchProjects() {
    const keyword = document.getElementById('domain').value;
    const projectsContainer = document.getElementById('projects');

    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(keyword)}&sort=stars&order=desc&per_page=10`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            projectsContainer.innerHTML = '';  // Clear previous results
            console.log(`Most-starred repositories for keyword "${keyword}":`);
            data.items.forEach(repo => {
                console.log(`- ${repo.full_name} with ${repo.stargazers_count} stars`);
                
                const projectElement = document.createElement('div');
                projectElement.innerHTML = `
                    <h3><a href="${repo.html_url}" target="_blank">${repo.full_name}</a></h3>
                    <p>${repo.description}</p>
                    <p>⭐ ${repo.stargazers_count} stars</p>
                `;
                projectsContainer.appendChild(projectElement);
            });
        })
        .catch(error => console.error('Error fetching projects:', error));
}

