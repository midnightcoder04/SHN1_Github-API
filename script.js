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
    // const resume = document.getElementById('resume').value;
    // const resumeContainer = document.getElementById('resume-container');
    // resumeContainer.innerHTML = resume;
 }

 function explainReadme() {
    // const readme = document.getElementById('readme').value;
    // const readmeContainer = document.getElementById('readme-container');
    // readmeContainer.innerHTML = readme;
 }

 function fetchProjects() {
    // const projects = document.getElementById('projects').value;
    // const projectsContainer = document.getElementById('projects-container');
    // projectsContainer.innerHTML = projects;
 }
