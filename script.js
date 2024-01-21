
const perPageOptions = [10, 20, 50, 100];
let currentPage = 1;
let repositoriesPerPage = 10;

async function getUser() {
    const username = $('#username').val().trim();
    if (username === '') {
        alert('Please enter a username.');
        return;
    }

    $('#loader').show();

    try {
        console.log(username);
        const apiUrl = `https://api.github.com/users/${username}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`GitHub API request failed: ${response.status}`);
        }

        const userDetails = await response.json();
        console.log(userDetails);
        displayUser(userDetails);
        getRepositories();
    } catch (error) {
        console.error(error);
        alert('Error fetching repositories. Please try again.');
    } finally {
        $('#loader').hide();
    }
}

async function getRepositories() {
    const username = $('#username').val().trim();
    if (username === '') {
        alert('Please enter a username.');
        return;
    }

    $('#loader').show();

    try {
        console.log(username);
        const apiUrl = `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${repositoriesPerPage}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`GitHub API request failed: ${response.status}`);
        }

        const repositories = await response.json();
        console.log(repositories);
        displayRepositories(repositories);
        updatePagination(repositories.length);
    } catch (error) {
        console.error(error);
        alert('Error fetching repositories. Please try again.');
    } finally {
        $('#loader').hide();
    }
}

function displayUser(userData) {
    console.log("user", userData);
    const userContainer = $('#user');
    userContainer.empty();


    const userHTML = `
        <div class="user-details">
        <div class="user-info">
        
        <img src="${userData.avatar_url}" alt="User Avatar" class="user-avatar">
        
        
        <div class="user-details">
        <h4 class='repo-h4'>${userData.login}</h4>
        ${userData.location ? `<div class="linkDiv"><i class="material-icons">location_on</i><p>${userData.blocationio}</p></div>` : ''}
        ${userData.bio ? `<p>${userData.bio}</p>` : ''}
        ${userData.twitter_username ? `<p>${userData.twitter_username}</p>` : ''}
        </div>
    </div>
    ${userData.html_url ? `<div class="linkDiv" ><i class="material-icons">link</i> <a href=${userData.html_url}>${userData.html_url}</p>` : ''}
    </div></div>
        `;
    console.log(userHTML);
    userContainer.append(userHTML);

}

function displayRepositories(repositories) {
    const repositoriesContainer = $('#repositories');
    repositoriesContainer.empty();

    repositories.forEach(repo => {
        const repositoryHTML = `
            <div class="repository">
                <h4>${repo.name}</h4>
                ${repo.language ? `<p class='language'>${repo.language}</p>` : ''}
                ${repo.topics.length ? `<p>Topics: ${repo.topics.join(', ')}</p>` : ''}
            </div>
        `;
        repositoriesContainer.append(repositoryHTML);
    });
}

function updatePagination(totalRepositories) {
    const totalPages = Math.ceil(totalRepositories / repositoriesPerPage);

    const paginationContainer = $('#pagination');
    paginationContainer.empty();
    const repoPerPage = $('#repoPerPage');
    repoPerPage.empty();
    const leftArrow = `<div class='pagination-arrow'>
        <span class="pagination-link" onclick="changePage(${currentPage - 1})"><i class='fa fa-angle-double-left'></i></span>
    </div>`;
    paginationContainer.append(leftArrow);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = `<div class="pagination-number ${i === currentPage ? 'active' : ''}">
        
        <span class="pagination-link ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</span>
        </div>`;
        paginationContainer.append(pageLink);
    }
    const rightArrow = `<div class='pagination-arrow'>
        <span class="pagination-link" onclick="changePage(${currentPage + 1})"><i class='fa fa-angle-double-right'></i></span>
    </div>`;
    paginationContainer.append(rightArrow);

    const perPageSelect = `<div class='perPageDiv'><span>Please Select Repository Per Page</span><select id="perPageSelect" class="form-control form-control-sm" onchange="changePerPage()">
        ${perPageOptions.map(option => `<option value="${option}" ${option === repositoriesPerPage ? 'selected' : ''}>${option}</option>`).join('')}
    </select></div>`;
    repoPerPage.append(perPageSelect);
}

function changePage(newPage) {
    currentPage = newPage;
    getUser()
}

function changePerPage() {
    repositoriesPerPage = parseInt($('#perPageSelect').val());
    currentPage = 1;
    getUser()
}

// Initial call to fetch repositories (optional)
// getRepositories();

