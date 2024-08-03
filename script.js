
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

 async function buildResume() {
    const username = document.getElementById('username').value;
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const user = await response.json();

        const repoResponse = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await repoResponse.json();

        const resumeContainer = document.getElementById('resume');
        let reposHtml = '';
        repos.forEach(repo => {
            reposHtml += `<li>${repo.name} (Created on: ${new Date(repo.created_at).toLocaleDateString()})</li>`;
        });

        resumeContainer.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}'s avatar" width="100" height="100">
            <h3>${user.login}</h3>
            <p><a href="${user.html_url}" target="_blank">${user.html_url}</a></p>
            <p>${user.bio || 'No bio available'}</p>
            <p>Public Repos: ${user.public_repos}</p>
            <p>Followers: ${user.followers}</p>
            <p>Following: ${user.following}</p>
            <h4>Repositories:</h4>
            <ul>${reposHtml}</ul>
            <button id="download-pdf">Download PDF</button>
        `;

        window.user = user;
        window.repos = repos;

        document.getElementById('download-pdf').addEventListener('click', function(e) {
            e.preventDefault();
            downloadPDF();
        });

    } catch (error) {
        console.error(error);
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const user = window.user;
    const repos = window.repos;

    doc.setFontSize(24);
    doc.text('GitHub Resume', 20, 20);

    doc.setFontSize(12);
    doc.text(`Username: ${user.login}`, 20, 40);
    doc.text(`Profile: ${user.html_url}`, 20, 50);
    doc.text(`Bio: ${user.bio || 'No bio available'}`, 20, 60);
    doc.text(`Public Repos: ${user.public_repos}`, 20, 70);
    doc.text(`Followers: ${user.followers}`, 20, 80);
    doc.text(`Following: ${user.following}`, 20, 90);
    doc.text(`Repositories:`,20,105);
    let y = 115;
    repos.forEach(repo => {
        doc.text(`- ${repo.name} (Created on: ${new Date(repo.created_at).toLocaleDateString()})`,20,y);
        y+=8;
    })

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = user.avatar_url;
    img.onload = function() {
        const imgData = getBase64Image(img);
        doc.addImage(imgData, 'PNG', 160,30,30,30);
        doc.save('resume.pdf');
    }
    img.onerror = function() {
        doc.save('resume.pdf');
    }
}

function getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0 ,0);
    return canvas.toDataURL("image/png");
}

async function explainReadme() {
    const repoLink = document.getElementById('readme').value;
    const ageGroup = document.getElementById('age-group').value;

    const repoParts = repoLink.replace('https://github.com/','').split('/');
    const username = repoParts[0];
    const repository = repoParts[1];

    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repository}/readme`, {
            headers: {
                Accept: "application/vnd.github.v3.raw"
            }  
        });
        const content = await response.text();
        const chatgptContent = await chatgptify(content, ageGroup);
        const readmeCurrentDiv = document.getElementById('readme-current');
        const readmeExplanationDiv = document.getElementById('readme-explanation');
        readmeCurrentDiv.innerHTML = `<h3>Readme:</h3> <pre> ${content}</pre>`;
        readmeExplanationDiv.innerHTML = `<h3>Explanation:</h3> <p> ${chatgptContent} </p>`;
    } catch (error) {
        console.error(error);
    }
}

 async function chatgptify(content, ageGroup) {
    const apiUrl = 'https://shn-1-github-6yapiivky-midnightcoder04s-projects.vercel.app';
    try {
        const response = await fetch(`${apiUrl}/api/explain-readme`, {
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
            projectsContainer.innerHTML = '';  
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

